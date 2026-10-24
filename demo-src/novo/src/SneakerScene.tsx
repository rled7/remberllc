import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { colorways, type SceneState } from './content';

function disposeObject(object: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => { if (value instanceof THREE.Texture) textures.add(value); });
      material.dispose();
    });
  });
  textures.forEach((texture) => texture.dispose());
}

export function SneakerScene({ state, reduced, onReady }: {
  state: RefObject<SceneState>; reduced: boolean; onReady: (ready: boolean) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let active = true;
    let renderer: THREE.WebGLRenderer;
    let object: THREE.Group | undefined;
    let lastTime = 0;
    let idleTime = 0;
    let running = false;
    let lastOpacity = -1;
    let wasCycling = false;
    let cycleStart = 0;
    let idleStrength = 0;
    let pointerX = 0;
    let pointerY = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
    camera.position.set(0, 0, 9);

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setStatus('fallback');
      onReady(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.25 : 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff8ee, 0x59645a, 1.8));
    const key = new THREE.DirectionalLight(0xfff7e8, 3.5);
    key.position.set(-3, 5, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe8f0ff, 2);
    rim.position.set(4, 2, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.7);
    fill.position.set(0, -3, 4);
    scene.add(fill);

    const accent = new THREE.Color(state.current.color);
    const targetColor = new THREE.Color();
    const cycleOrigin = new THREE.Color();
    const cycleTarget = new THREE.Color();
    const cyclingColor = new THREE.Color();
    const rig = new THREE.Group();
    const pointerRig = new THREE.Group();
    const float = new THREE.Group();
    rig.add(pointerRig);
    pointerRig.add(float);
    scene.add(rig);

    const render = (time: number) => {
      const data = state.current;
      const delta = lastTime ? time - lastTime : 16.67;
      lastTime = time;
      if (delta > 0 && delta < 250) {
        data.frameTimes[data.frames % 180] = delta;
      }
      data.frames += 1;
      idleTime += Math.min(delta / 1000, 0.05);
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const viewWidth = viewHeight * camera.aspect;
      const mobile = width < 768;
      const mobileY = data.scene === 'hero' ? -0.2 : data.scene === 'colorways' ? -0.07 : -0.27;
      rig.position.set((mobile ? 0 : data.x) * viewWidth, (mobile ? mobileY : data.y) * viewHeight, data.z);
      const fitScale = mobile ? Math.min(0.8, viewWidth / 3.9 * 0.93) : Math.min(1, viewWidth * 0.56 / 3.9);
      rig.scale.setScalar(data.scale * fitScale);
      rig.rotation.set(data.rx, data.ry, data.rz);
      const pointerResponse = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 50) * 0.009);
      pointerX += ((reduced ? 0 : data.pointerX) - pointerX) * pointerResponse;
      pointerY += ((reduced ? 0 : data.pointerY) - pointerY) * pointerResponse;
      pointerRig.rotation.set(pointerY * 0.075, pointerX * 0.13, 0);
      pointerRig.position.set(pointerX * 0.09, -pointerY * 0.06, 0);
      const idle = data.idle && !reduced;
      idleStrength += ((idle ? 1 : 0) - idleStrength) * (1 - Math.exp(-Math.min(delta, 50) * 0.006));
      float.position.y = Math.sin(idleTime * 0.8) * 0.09 * idleStrength;
      float.rotation.y = Math.sin(idleTime * 0.24) * 0.12 * idleStrength;
      if (data.cycle && !reduced) {
        if (!wasCycling) { cycleStart = idleTime; cycleOrigin.copy(accent); }
        const phase = (idleTime - cycleStart) / 5;
        const step = Math.floor(phase);
        const index = step % colorways.length;
        const blend = phase - step;
        const from = step === 0 ? cycleOrigin : targetColor.set(colorways[(index + 3) % 4].color);
        cyclingColor.copy(from).lerp(cycleTarget.set(colorways[index].color), blend * blend * (3 - 2 * blend));
        accent.copy(targetColor.set(data.color)).lerp(cyclingColor, data.cycleMix);
      } else accent.copy(targetColor.set(data.color));
      wasCycling = data.cycle;
      data.materialColor = accent.getHex();
      const companionMobile = mobile && data.scene.startsWith('story');
      const opacity = reduced ? (window.scrollY < height * 0.7 ? 1 : 0) : data.opacity * (companionMobile ? 0.14 : 1);
      if (opacity !== lastOpacity) { host.style.opacity = String(opacity); lastOpacity = opacity; }
      renderer.render(scene, camera);
    };

    const updateLoop = () => {
      const shouldRun = active && !document.hidden && window.scrollY < (document.getElementById('explore')?.offsetTop ?? Infinity);
      if (reduced) {
        renderer.setAnimationLoop(null);
        running = false;
        if (active && !document.hidden) render(performance.now());
        return;
      }
      if (shouldRun && !running) {
        running = true;
        lastTime = 0;
        renderer.setAnimationLoop(render);
      } else if (!shouldRun && running) {
        running = false;
        renderer.setAnimationLoop(null);
        host.style.opacity = '0';
        lastOpacity = 0;
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.25 : 1.75));
      renderer.setSize(width, height);
      if (reduced && active) render(performance.now());
    };

    const lost = (event: Event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      running = false;
      setStatus('fallback');
      host.style.opacity = window.scrollY < height ? '1' : '0';
    };

    new GLTFLoader().load(`${import.meta.env.BASE_URL}models/sneaker.glb`, (gltf) => {
      if (!active) { disposeObject(gltf.scene); return; }
      object = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(object);
      const size = bounds.getSize(new THREE.Vector3());
      if (size.z > size.x) object.rotation.y += Math.PI / 2;
      bounds.setFromObject(object);
      const alignedSize = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 3.9 / Math.max(alignedSize.x, alignedSize.z);
      object.position.sub(center);
      const normalization = new THREE.Group();
      normalization.add(object);
      normalization.scale.setScalar(scale);

      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox!;
        const bottom = box.min.y;
        const upper = box.max.y - bottom;
        const original = child.material as THREE.MeshStandardMaterial;
        const material = original.clone();
        // Neutralize baked color while preserving the source's normal and surface maps.
        material.map = null;
        material.color.set('#ffffff');
        material.metalness = 0.05;
        material.roughness = 0.82;
        material.onBeforeCompile = (shader) => {
          shader.uniforms.novoAccent = { value: accent };
          shader.vertexShader = 'varying float novoHeight;\n' + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nnovoHeight = position.y;');
          shader.fragmentShader = 'uniform vec3 novoAccent;\nvarying float novoHeight;\n' + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>\nfloat upperMask = smoothstep(${(bottom + upper * 0.17).toFixed(6)}, ${(bottom + upper * 0.24).toFixed(6)}, novoHeight);\ndiffuseColor.rgb *= mix(vec3(0.72, 0.70, 0.65), novoAccent, upperMask);`);
        };
        child.material = material;
        original.dispose();
      });
      float.add(normalization);
      renderer.compile(scene, camera);
      setStatus('ready');
      state.current.loaded = true;
      onReady(true);
      updateLoop();
    }, undefined, () => {
      if (!active) return;
      setStatus('fallback');
      onReady(true);
    });

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', updateLoop, { passive: true });
    document.addEventListener('visibilitychange', updateLoop);
    renderer.domElement.addEventListener('webglcontextlost', lost);

    return () => {
      active = false;
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateLoop);
      document.removeEventListener('visibilitychange', updateLoop);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      if (object) disposeObject(object);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [state, reduced, onReady]);

  return <div ref={container} className={`scene-stage scene-stage--${status}`} data-renderer={status} role="img" aria-label="A floating three-dimensional sneaker concept">
    <img className="scene-fallback" src={`${import.meta.env.BASE_URL}images/sneaker-fallback.png`} alt="Sneaker model preview" />
  </div>;
}
