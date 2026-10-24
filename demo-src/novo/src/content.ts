export const colorways = [
  { name: 'Chalk', code: '01', color: '#d9d3c6', background: '#25251f', description: 'A quieter kind of statement.' },
  { name: 'Volt', code: '02', color: '#c9ed72', background: '#26321c', description: 'For a little more electric.' },
  { name: 'Ember', code: '03', color: '#d68e70', background: '#38241f', description: 'Warmth, with an edge.' },
  { name: 'Glacier', code: '04', color: '#99bed4', background: '#1e2c36', description: 'A fresh perspective.' },
] as const;

export const features = [
  { id: 'form', number: '01', eyebrow: 'Adaptive Sole technology', title: ['ADAPTIVE', 'BY NATURE.'], description: 'Meet the Adaptive Sole. A sculpted foundation imagined to follow the rhythm of your everyday.', detail: 'Adaptive Sole / a flexible foundation', className: 'feature--form' },
  { id: 'feeling', number: '02', eyebrow: 'Precision Weight Distribution', title: ['BALANCE.', 'REDEFINED.'], description: 'Precision Weight Distribution. A considered approach to balance, from the heel to the very next step.', detail: 'Precision Weight Distribution', className: 'feature--feeling' },
  { id: 'detail', number: '03', eyebrow: 'Breathable Mesh Construction', title: ['ROOM TO', 'BREATHE.'], description: 'Breathable Mesh Construction. An exploration of open textures, thoughtful structure, and a lighter feeling.', detail: 'Breathable Mesh / considered construction', className: 'feature--detail' },
] as const;

// These describe the demo itself. Replace them with sourced brand metrics later.
export const statistics = [
  { value: 3, pad: true, label: 'Feature perspectives' },
  { value: 4, pad: true, label: 'Ways to make it yours' },
  { value: 1, pad: true, label: 'Continuous 3D experience' },
] as const;

export type SceneState = {
  x: number; y: number; z: number;
  rx: number; ry: number; rz: number;
  scale: number; color: string; opacity: number;
  idle: boolean; cycle: boolean; cycleMix: number; materialColor: number; scene: string; progress: number;
  pointerX: number; pointerY: number;
  layoutVersion: number;
  loaded: boolean; frames: number; frameTimes: number[];
};

export const initialScene = (): SceneState => ({
  x: 0.2, y: 0.03, z: 0, rx: 0.15, ry: -0.32, rz: -0.22,
  scale: 1, color: colorways[0].color, opacity: 1,
  idle: true, cycle: false, cycleMix: 0, materialColor: 0, scene: 'hero', progress: 0,
  pointerX: 0, pointerY: 0,
  layoutVersion: 0,
  loaded: false, frames: 0, frameTimes: [],
});

declare global {
  interface Window { __novo?: SceneState; }
}
