import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** true si l'utilisateur a demandé à réduire les animations : chaque effet a alors un équivalent statique. */
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pointeur fin (souris) : curseur personnalisé, survols, etc. */
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const EASE = 'power3.out';

/**
 * Révélations génériques au scroll.
 *  - [data-reveal="up"]   : glisse de 40 px vers le haut avec un fondu.
 *  - [data-reveal-group]  : les enfants [data-reveal] apparaissent en cascade
 *    (écart lu dans data-reveal-group, en secondes).
 */
export function initReveals(root: ParentNode = document) {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-ready])'));
  items.forEach((el) => (el.dataset.revealReady = ''));
  const fresh = new Set(items);
  if (reducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }
  const grouped = new Set<HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const children = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]')).filter((c) => fresh.has(c));
    if (!children.length) return;
    children.forEach((c) => grouped.add(c));
    const stagger = parseFloat(group.dataset.revealGroup || '0.1') || 0.1;
    gsap.fromTo(
      children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE,
        stagger,
        scrollTrigger: { trigger: group, start: 'top 82%', once: true },
      }
    );
  });
  items
    .filter((el) => !grouped.has(el))
    .forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: el.dataset.reveal === 'fade' ? 0 : 40 },
        { opacity: 1, y: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      );
    });
}

export { gsap, ScrollTrigger };
