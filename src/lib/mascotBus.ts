/** Tiny event bus so the quiz can make the mascot react without prop-drilling. */
export type MascotEvent = { type: 'correct' } | { type: 'wrong' } | { type: 'streak'; count: number };
const NAME = 'hsv:mascot';

export function emitMascot(detail: MascotEvent) {
  window.dispatchEvent(new CustomEvent<MascotEvent>(NAME, { detail }));
}
export function onMascot(handler: (e: MascotEvent) => void): () => void {
  const fn = (ev: Event) => handler((ev as CustomEvent<MascotEvent>).detail);
  window.addEventListener(NAME, fn);
  return () => window.removeEventListener(NAME, fn);
}
