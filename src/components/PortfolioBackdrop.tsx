import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const vertex = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() { vUv = aPosition * 0.5 + 0.5; gl_Position = vec4(aPosition, 0., 1.); }
`;

const fragment = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uMatrix;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uColor;
uniform sampler2D uGlyphs;

float hash3(vec3 p) {
  p = fract(p * .3183099 + vec3(.1, .2, .3));
  p *= 17.;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash3(i), hash3(i+vec3(1,0,0)), f.x),
                 mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), f.x),
                 mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), f.x), f.y), f.z);
}
float fog(vec3 p) {
  float t = uTime * .075;
  vec3 q = p * 1.15 + vec3(t * .35, -t, t * .2);
  q += .55 * vec3(sin(q.y * 1.4 + t), cos(q.z + q.x - t), sin(q.x * 1.2 - t));
  float n = noise3(q) * .58 + noise3(q * 2.12 + 7.3) * .28 + noise3(q * 4.31 + 3.7) * .14;
  return smoothstep(.46, .72, n) * exp(-dot(p.xy * vec2(.42,.34), p.xy * vec2(.42,.34)));
}
vec3 smoke(vec2 uv) {
  vec2 screen = (uv - .5) * vec2(uResolution.x/uResolution.y, 1.) * 2.8;
  vec3 origin = vec3(uPointer * .50, 4.);
  vec3 ray = normalize(vec3(screen - uPointer * .40, -3.5));
  vec4 volume = vec4(0.);
  for (int i=0; i<12; i++) {
    float depth = float(i) / 11.;
    vec3 p = origin + ray * (1. + float(i) * .46);
    // Near wisps move farther than distant banks for visible spatial parallax.
    p.xy += (uPointer * vec2(.22,.14) + vec2(0.,uScroll * .8)) * mix(.9,.12,depth);
    float density = fog(p) * .24;
    float light = .6 + .4 * noise3(p * .8 + vec3(2.,uTime*.025,0.));
    vec3 tint = mix(uColor, vec3(.20,.28,.43), depth * .55);
    tint *= mix(1.18,.72,depth);
    volume.rgb += (1. - volume.a) * density * tint * light;
    volume.a += (1. - volume.a) * density;
  }
  return vec3(.026,.037,.055) + volume.rgb * 1.1;
}
float random(vec2 p) { return hash3(vec3(p, 4.7)); }
vec3 rainLayer(vec2 uv, float cell, float speed, float depth) {
  vec2 pixels = uv * uResolution + uPointer * depth;
  vec2 grid = pixels / vec2(cell, cell * 1.4);
  vec2 id = floor(grid);
  float seed = random(vec2(id.x, floor(depth)));
  float head = 1. - fract(uTime * speed * (.6 + seed) + seed);
  float trail = mod(uv.y - head + 1., 1.);
  float strength = exp(-trail * 7.5);
  float glyph = floor(random(id + vec2(0.,floor(uTime * 2.5 + seed * 11.))) * 64.);
  vec2 tile = vec2(mod(glyph, 8.), floor(glyph / 8.));
  vec2 glyphUv = vec2(fract(grid.x), 1. - fract(grid.y));
  float ink = texture2D(uGlyphs, (tile + glyphUv) / 8.).a;
  vec3 green = mix(vec3(.02,.36,.21), vec3(.24,.9,.58), depth / 20.);
  vec3 color = mix(green, vec3(.65,1.,.78), exp(-trail * 160.));
  return color * ink * strength;
}
void main() {
  vec3 color = uMatrix < .999 ? smoke(vUv) : vec3(.026,.037,.055);
  if (uMatrix > .001) {
    vec3 rain = rainLayer(vUv, 18., .065, 7.) * .45
              + rainLayer(vUv + vec2(.11,0.), 28., .095, 18.) * .75;
    color = mix(color, vec3(.017,.035,.033) + rain * .8, uMatrix);
  }
  float vignette = 1. - .28 * smoothstep(.2,.85,length(vUv-.5));
  gl_FragColor = vec4(color * vignette, 1.);
}
`;

const palette = [[.32,.36,.68], [.49,.22,.60], [.15,.46,.62], [.13,.52,.36], [.44,.25,.55]];
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export default function PortfolioBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pathname } = useLocation();
  const routeRef = useRef(pathname);
  routeRef.current = pathname;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!gl) { canvas.dataset.renderer = 'fallback'; return; }
    const resources: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      resources.push(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
      return shader;
    };
    const program = gl.createProgram()!;
    let buffer: WebGLBuffer | null = null;
    let texture: WebGLTexture | null = null;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Background program failed to link');
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const atlas = document.createElement('canvas');
      atlas.width = atlas.height = 256;
      const context = atlas.getContext('2d')!;
      context.fillStyle = '#fff';
      context.font = '24px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const glyphs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテ';
      for (let i=0; i<64; i++) context.fillText(glyphs[i % glyphs.length], (i%8)*32+16, Math.floor(i/8)*32+16);
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, 'uGlyphs'), 0);
    } catch (error) {
      console.warn('Portfolio background unavailable:', error);
      resources.forEach(shader => gl.deleteShader(shader));
      gl.deleteBuffer(buffer); gl.deleteTexture(texture); gl.deleteProgram(program);
      canvas.dataset.renderer = 'fallback';
      return;
    }

    const uniforms = Object.fromEntries(['uTime','uMatrix','uScroll','uResolution','uPointer','uColor'].map(name => [name, gl.getUniformLocation(program, name)]));
    let frame = 0, clock = 0, previous = performance.now(), matrix = 0, targetMatrix = 0;
    let targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
    let targetProgress = 0, progress = 0, lost = false, scrollDirty = true;
    let resolutionScale = .4, slowFrames = 0;
    const finePointer = matchMedia('(pointer: fine)').matches;
    const resize = () => {
      const cap = innerWidth < 720 ? 480 : 640;
      const scale = Math.min(resolutionScale, cap / innerWidth, 540 / innerHeight);
      canvas.width = Math.max(1, Math.round(innerWidth * scale));
      canvas.height = Math.max(1, Math.round(innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uResolution, innerWidth, innerHeight);
      scrollDirty = true;
    };
    const sampleScroll = () => {
      const distance = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      targetProgress = clamp(scrollY / distance);
      const work = document.getElementById('work');
      if (routeRef.current.startsWith('/projects/')) targetMatrix = 1;
      else if (work) {
        const rect = work.getBoundingClientRect();
        targetMatrix = Math.min(clamp((innerHeight * .55 - rect.top) / (innerHeight * .55)), clamp((rect.bottom - innerHeight * .1) / (innerHeight * .5)));
      } else targetMatrix = 0;
      scrollDirty = false;
    };
    const draw = (now: number) => {
      frame = 0;
      if (lost || document.hidden) return;
      const dt = Math.min(.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      const reduced = reducedMotion.matches;
      if (!reduced) clock += dt;
      if (scrollDirty) sampleScroll();
      const blend = reduced ? 1 : 1 - Math.exp(-dt * 5);
      matrix += (targetMatrix - matrix) * blend;
      progress += (targetProgress - progress) * blend;
      pointerX += ((reduced ? 0 : targetX) - pointerX) * blend;
      pointerY += ((reduced ? 0 : targetY) - pointerY) * blend;
      const colorPos = progress * (palette.length - 1);
      const colorIndex = Math.min(palette.length - 2, Math.floor(colorPos));
      const colorMix = colorPos - colorIndex;
      const color = palette[colorIndex].map((value, i) => value + (palette[colorIndex + 1][i] - value) * colorMix);
      gl.uniform1f(uniforms.uTime, clock);
      gl.uniform1f(uniforms.uMatrix, matrix);
      gl.uniform1f(uniforms.uScroll, reduced ? 0 : progress * 1.6);
      gl.uniform2f(uniforms.uPointer, pointerX, pointerY);
      gl.uniform3fv(uniforms.uColor, color);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.matrix = matrix.toFixed(3);
      canvas.dataset.progress = progress.toFixed(3);
      canvas.dataset.frame = String(Math.round(clock * 60));
      // Scale the decorative volume down if this device consistently misses frames.
      if (dt > .0225 && !reduced) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 30 && resolutionScale > .3) { resolutionScale *= .8; resize(); slowFrames = 0; }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && !document.hidden && !lost) { previous = performance.now(); frame = requestAnimationFrame(draw); } };
    const onScroll = () => { scrollDirty = true; wake(); };
    const onResize = () => { resize(); wake(); };
    const onPointer = (event: PointerEvent) => {
      if (!finePointer || reducedMotion.matches) return;
      targetX = event.clientX / innerWidth * 2 - 1;
      targetY = 1 - event.clientY / innerHeight * 2;
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); };
    const contextLost = () => { lost = true; cancelAnimationFrame(frame); canvas.dataset.renderer = 'fallback'; };
    canvas.dataset.renderer = 'ready';
    resize(); wake();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    reducedMotion.addEventListener('change', onScroll);
    canvas.addEventListener('webglcontextlost', contextLost);
    const observer = new ResizeObserver(onScroll);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', visibility);
      reducedMotion.removeEventListener('change', onScroll);
      canvas.removeEventListener('webglcontextlost', contextLost);
      resources.forEach(shader => gl.deleteShader(shader));
      gl.deleteBuffer(buffer); gl.deleteTexture(texture); gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => { window.dispatchEvent(new Event('scroll')); }, [pathname]);
  return <canvas className="portfolio-backdrop" ref={canvasRef} aria-hidden="true" />;
}
