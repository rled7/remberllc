import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { colorways, type SceneState } from './content';

gsap.registerPlugin(ScrollTrigger);

const lerp = (a: number, b: number, progress: number) => a + (b - a) * progress;
type Pose = Pick<SceneState, 'x' | 'y' | 'z' | 'rx' | 'ry' | 'rz' | 'scale'>;
const poses: Pose[] = [
  { x: 0.2, y: 0.03, z: 0, rx: 0.15, ry: -0.32, rz: -0.22, scale: 1 },
  { x: 0.23, y: 0.02, z: 0.2, rx: 0.3, ry: 0.5, rz: -0.15, scale: 1.02 },
  { x: -0.23, y: -0.02, z: 0, rx: -0.12, ry: Math.PI - 0.35, rz: 0.18, scale: 0.98 },
  { x: 0, y: -0.13, z: 0.4, rx: 0.5, ry: Math.PI * 2 - 0.4, rz: -0.12, scale: 0.95 },
  { x: 0.06, y: -0.02, z: 0, rx: 0.12, ry: Math.PI * 2 - 0.3, rz: -0.12, scale: 1.05 },
];

export function setupMotion(root: HTMLElement, state: SceneState, reduced: boolean, onColorChange: (index: number) => void) {
  const removeListeners: (() => void)[] = [];
  const nav = root.querySelector<HTMLElement>('.nav')!;
  const closing = root.querySelector<HTMLElement>('.closing')!;
  let disposed = false;
  let activeColor = -1;
  const refreshed = () => { state.layoutVersion += 1; };
  ScrollTrigger.addEventListener('refresh', refreshed);
  removeListeners.push(() => ScrollTrigger.removeEventListener('refresh', refreshed));

  const context = gsap.context(() => {
    ScrollTrigger.create({ start: 30, end: 'max', onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 30) });
    nav.classList.toggle('is-scrolled', window.scrollY > 30);

    if (!reduced) {
      gsap.utils.toArray<HTMLElement>('[data-global-depth]', root).forEach((layer) => {
        const depth = Number(layer.dataset.globalDepth);
        gsap.fromTo(layer, { y: -window.innerHeight * depth * 0.1, scale: 1 - depth * 0.03 }, {
          y: () => window.innerHeight * depth * 0.5, scale: 1 + depth * 0.1, ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: true, invalidateOnRefresh: true },
        });
      });
      gsap.from('.nav .wordmark, .nav nav a', { opacity: 0, y: -8, duration: 0.7, stagger: 0.05, ease: 'power2.out' });
      const revealElements = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      revealElements.forEach((element) => {
        const feature = element.closest('.feature');
        const from = feature?.classList.contains('feature--form') ? { opacity: 0, x: -65, y: 12, rotationY: 8 }
          : feature?.classList.contains('feature--feeling') ? { opacity: 0, x: 65, y: 16, rotation: -2 }
          : feature?.classList.contains('feature--detail') ? { opacity: 0, y: 50, scale: 0.94 }
          : { opacity: 0, y: 26 };
        gsap.fromTo(element, from, {
          opacity: 1, x: 0, y: 0, rotationY: 0, rotation: 0, scale: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        });
      });

      const sections = gsap.utils.toArray<HTMLElement>('[data-scene]', root);
      sections.forEach((section, index) => {
        if (section.id === 'colorways') return;
        const from = poses[Math.max(0, index - 1)];
        const to = poses[index];
        const update = (progress: number) => {
          const t = Math.min(1, progress * 2);
          const poseProgress = t * t * (3 - 2 * t);
          const keys = Object.keys(to) as (keyof Pose)[];
          keys.forEach((key) => { state[key] = lerp(from[key], to[key], poseProgress); });
          state.scene = section.dataset.scene!;
          state.progress = progress;
          state.idle = index === 0;
          state.cycle = false;
          state.cycleMix = 0;
          state.opacity = 1;
          state.color = colorways[0].color;
        };
        ScrollTrigger.create({
          trigger: section, start: index === 0 ? 'top top' : 'top center', end: 'bottom center',
          onUpdate: (self) => { if (self.isActive) update(self.progress); },
          onToggle: (self) => { if (self.isActive) update(self.progress); },
          onRefresh: (self) => { if (self.isActive) update(self.progress); },
        });
        gsap.utils.toArray<HTMLElement>('[data-depth]', section).forEach((layer) => {
          const depth = Number(layer.dataset.depth);
          gsap.fromTo(layer, { y: () => window.innerHeight * depth }, {
            y: () => -window.innerHeight * depth, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          });
        });
      });

      const colors = root.querySelector<HTMLElement>('#colorways')!;
      const paintColor = (progress: number) => {
        const scaled = progress * 3;
        const first = Math.min(2, Math.floor(scaled));
        const blend = scaled - first;
        const a = colorways[first];
        const b = colorways[first + 1];
        const index = Math.min(3, Math.round(scaled));
        Object.assign(state, poses[4]);
        state.ry += progress * 0.4;
        state.scene = 'colorways';
        state.progress = progress;
        state.idle = false;
        state.cycle = false;
        state.cycleMix = 0;
        state.opacity = 1;
        state.color = gsap.utils.interpolate(a.color, b.color, blend);
        colors.style.backgroundColor = gsap.utils.interpolate(a.background, b.background, blend);
        colors.style.setProperty('--color-progress', String(progress));
        if (index !== activeColor) { activeColor = index; onColorChange(index); }
      };
      const colorTrigger = ScrollTrigger.create({
        trigger: colors, start: 'top top', end: 'bottom bottom',
        onRefresh: (self) => { if (self.scroll() >= self.start && self.scroll() <= self.end) paintColor(self.progress); },
      });
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: () => {
          const position = window.scrollY;
          if (position >= colorTrigger.start && position <= colorTrigger.end) {
            paintColor((position - colorTrigger.start) / (colorTrigger.end - colorTrigger.start));
          }
        },
      });

      // Bridge the gap between the last feature and the sticky color scene.
      ScrollTrigger.create({ trigger: colors, start: 'top center', end: 'top top', onUpdate: (self) => {
        if (!self.isActive) return;
        const from = poses[3], to = poses[4];
        (Object.keys(to) as (keyof Pose)[]).forEach((key) => { state[key] = lerp(from[key], to[key], self.progress); });
        state.opacity = 1; state.idle = false; state.scene = 'colorways';
      } });

      const story = root.querySelector<HTMLElement>('#story')!;
      const companion: Pose = { x: 0.27, y: -0.02, z: 0, rx: 0.18, ry: Math.PI * 2 - 0.32, rz: -0.17, scale: 0.62 };
      const transitionToStory = (progress: number) => {
        const t = progress * progress * (3 - 2 * progress);
        const from = { ...poses[4], ry: poses[4].ry + 0.4 };
        (Object.keys(companion) as (keyof Pose)[]).forEach((key) => { state[key] = lerp(from[key], companion[key], t); });
        Object.assign(state, { idle: true, cycle: progress > 0, cycleMix: t, scene: 'story-transition', progress, opacity: 1, color: colorways[3].color });
      };
      ScrollTrigger.create({
        trigger: story, start: 'top bottom', end: 'top 30%',
        onUpdate: (self) => { if (self.isActive) transitionToStory(self.progress); },
        onToggle: (self) => { if (self.isActive) transitionToStory(self.progress); },
        onRefresh: (self) => { if (self.isActive) transitionToStory(self.progress); },
      });
      const showCompanion = (progress: number) => Object.assign(state, companion, { idle: true, cycle: true, cycleMix: 1, scene: 'story-and-stats', progress, opacity: 1 });
      ScrollTrigger.create({
        trigger: story, start: 'top 30%', endTrigger: '#explore', end: 'top center',
        onUpdate: (self) => {
          if (!self.isActive) return;
          showCompanion(self.progress);
        },
        onToggle: (self) => { if (self.isActive) showCompanion(self.progress); },
        onRefresh: (self) => { if (self.isActive) showCompanion(self.progress); },
      });
      gsap.to(state, { opacity: 0, ease: 'none', scrollTrigger: { trigger: '#explore', start: 'top 70%', end: 'top 20%', scrub: true } });

      gsap.utils.toArray<HTMLElement>('[data-story-line]', root).forEach((line) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: line, start: 'center 70%', end: 'center 30%', scrub: true } });
        timeline.fromTo(line, { opacity: 0.14 }, { opacity: 1, duration: 0.5, ease: 'none' })
          .to(line, { opacity: 0.18, duration: 0.5, ease: 'none' });
      });

      gsap.utils.toArray<HTMLElement>('[data-counter]', root).forEach((counter) => {
        const number = { value: 0 };
        counter.textContent = '00';
        gsap.to(number, {
          value: Number(counter.dataset.counter), duration: 1.5, ease: 'power2.out',
          scrollTrigger: {
            trigger: counter.closest('.stat'),
            start: () => {
              const wrapper = counter.closest<HTMLElement>('.stat')!;
              return wrapper.getBoundingClientRect().top + window.scrollY + counter.offsetTop + counter.offsetHeight / 2 - window.innerHeight / 2;
            },
            once: true,
          },
          onUpdate: () => { counter.textContent = String(Math.round(number.value)).padStart(counter.dataset.pad === 'true' ? 2 : 1, '0'); },
        });
      });
    } else {
      state.idle = false;
      state.opacity = 1;
      state.scene = 'hero';
      gsap.set('[data-reveal], [data-story-line]', { opacity: 1, y: 0 });
    }

    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const aura = root.querySelector<HTMLElement>('.cursor-aura')!;
      const followX = gsap.quickTo(aura, 'x', { duration: 0.28, ease: 'power3.out' });
      const followY = gsap.quickTo(aura, 'y', { duration: 0.28, ease: 'power3.out' });
      let cursorVisible = false;
      const planes = gsap.utils.toArray<HTMLElement>('[data-mouse-depth]', root).map((plane) => {
        const depth = Number(plane.dataset.mouseDepth);
        return {
          depth,
          x: gsap.quickTo(plane, 'x', { duration: 0.45, ease: 'power3.out' }),
          y: gsap.quickTo(plane, 'y', { duration: 0.45, ease: 'power3.out' }),
          rx: gsap.quickTo(plane, 'rotationX', { duration: 0.6, ease: 'power3.out' }),
          ry: gsap.quickTo(plane, 'rotationY', { duration: 0.6, ease: 'power3.out' }),
        };
      });
      const pointerMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const x = event.clientX / window.innerWidth * 2 - 1;
        const y = event.clientY / window.innerHeight * 2 - 1;
        state.pointerX = x;
        state.pointerY = y;
        followX(event.clientX);
        followY(event.clientY);
        if (!cursorVisible) { cursorVisible = true; gsap.to(aura, { opacity: 1, duration: 0.2 }); }
        aura.classList.toggle('is-hovering', Boolean((event.target as Element)?.closest('a, button')));
        planes.forEach((plane) => {
          plane.x(-x * plane.depth * 42);
          plane.y(-y * plane.depth * 28);
          plane.rx(y * plane.depth * 2);
          plane.ry(-x * plane.depth * 3);
        });
      };
      const pointerLeave = () => {
        state.pointerX = 0; state.pointerY = 0;
        cursorVisible = false;
        gsap.to(aura, { opacity: 0, duration: 0.2 });
        planes.forEach((plane) => { plane.x(0); plane.y(0); plane.rx(0); plane.ry(0); });
      };
      window.addEventListener('pointermove', pointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', pointerLeave);
      removeListeners.push(() => { window.removeEventListener('pointermove', pointerMove); document.documentElement.removeEventListener('pointerleave', pointerLeave); });

      const light = closing.querySelector('.closing-light')!;
      const moveX = gsap.quickTo(light, 'x', { duration: 0.65, ease: 'power3.out' });
      const moveY = gsap.quickTo(light, 'y', { duration: 0.65, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const rect = closing.getBoundingClientRect();
        moveX((event.clientX - rect.left - rect.width / 2) * 0.45);
        moveY((event.clientY - rect.top - rect.height / 2) * 0.45);
      };
      const reset = () => { moveX(0); moveY(0); };
      closing.addEventListener('pointermove', move);
      closing.addEventListener('pointerleave', reset);
      removeListeners.push(() => { closing.removeEventListener('pointermove', move); closing.removeEventListener('pointerleave', reset); });
    }
  }, root);

  // Refresh once text metrics have settled; asset loading does not alter layout.
  void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
  return () => {
    disposed = true;
    removeListeners.forEach((remove) => remove());
    context.revert();
  };
}
