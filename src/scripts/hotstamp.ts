import { gsap, reducedMotion } from './motion';

/**
 * Animation signature : marquage à chaud / dorure.
 * 3 temps : légère dépression (ombre interne) → révélation dorée sable → reflet qui balaie de gauche à droite.
 *  - version longue (logo du hero d'accueil) : 1,6 s au total ;
 *  - version courte (H1 des pages d'offre)   : 0,8 s au total.
 * Avec prefers-reduced-motion : état final doré affiché directement, sans reflet.
 */
export function playHotStamp(el: HTMLElement, total = 1.6, delay = 0.2) {
  const deboss = el.querySelector<HTMLElement>('[data-stamp-deboss]');
  const gold = el.querySelector<HTMLElement>('[data-stamp-gold]');
  const sheen = el.querySelector<HTMLElement>('[data-stamp-sheen]');
  if (!deboss || !gold || !sheen) return;

  if (reducedMotion()) {
    gsap.set([deboss, gold], { opacity: 1, scale: 1, filter: 'none' });
    gsap.set(sheen, { opacity: 0 });
    return;
  }
  const k = total / 1.6; // 0,5 → 0,6 → 0,5 s pour la version longue
  const tl = gsap.timeline({ delay });
  tl.fromTo(deboss, { opacity: 0, scale: 1.035 }, { opacity: 1, scale: 1, duration: 0.5 * k, ease: 'power2.out' })
    .fromTo(gold, { opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.6 * k, ease: 'power1.inOut' })
    .fromTo(
      sheen,
      { opacity: 1, backgroundPosition: '100% 0' },
      { backgroundPosition: '0% 0', duration: 0.5 * k, ease: 'power1.inOut' }
    )
    .set(sheen, { opacity: 0 });
  return tl;
}

export function initHotStamps() {
  document.querySelectorAll<HTMLElement>('[data-stamp]:not([data-stamp-ready])').forEach((el) => {
    el.dataset.stampReady = '';
    const total = parseFloat(el.dataset.stampDuration || '1.6');
    playHotStamp(el, total, parseFloat(el.dataset.stampDelay || '0.2'));
  });
}
