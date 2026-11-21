/**
 * Silhouettes de l'aperçu du Studio cadeaux (viewBox 400 × 400).
 *  - body   : contour de la pièce (rempli avec la couleur du cuir) ;
 *  - under  : détails dessinés sous la pièce (disque du vinyle…) ;
 *  - extra  : détails dessinés par-dessus (anneau, fermeture…) ;
 *  - stitch : ligne de couture (pointillés à la couleur du fil) ;
 *  - mark   : zone où le logo est marqué (en unités du viewBox).
 * Pour ajouter une silhouette : l'ajouter ici ET dans les options « forme » de keystatic.config.ts.
 */
export type Shape = {
  body: string;
  under?: string;
  extra?: string;
  stitch: string;
  mark: { x: number; y: number; w: number; h: number };
};

/** Rectangle à coins arrondis, sous forme de chemin SVG. */
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`;

/** Couture parallèle au bord, en retrait de `i`. */
const inset = (x: number, y: number, w: number, h: number, r: number, i = 9) =>
  rr(x + i, y + i, w - 2 * i, h - 2 * i, Math.max(r - i, 1));

const METAL = 'url(#studio-metal)';

export const SHAPES: Record<string, Shape> = {
  'porte-cles': {
    body: rr(145, 110, 110, 220, 55),
    extra:
      `<circle cx="200" cy="150" r="11" fill="#0d0b0a" opacity=".85"/>` +
      `<circle cx="200" cy="88" r="40" fill="none" stroke="${METAL}" stroke-width="7"/>` +
      `<rect x="193" y="118" width="14" height="30" rx="5" fill="${METAL}"/>`,
    stitch: inset(145, 110, 110, 220, 55),
    mark: { x: 160, y: 200, w: 80, h: 80 },
  },
  'porte-cartes': {
    body: rr(80, 115, 240, 170, 16),
    extra: `<path d="M80,175 Q200,195 320,175" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="2"/>`,
    stitch: inset(80, 115, 240, 170, 16),
    mark: { x: 145, y: 200, w: 110, h: 60 },
  },
  etiquette: {
    body: 'M150,150 L200,105 L250,150 V315 A14,14 0 0 1 236,329 H164 A14,14 0 0 1 150,315 Z',
    extra:
      `<circle cx="200" cy="140" r="9" fill="#0d0b0a" opacity=".85"/>` +
      `<path d="M200,131 C200,90 230,60 262,52" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="9" stroke-linecap="round"/>`,
    stitch: 'M159,154 L200,117 L241,154 V311 A6,6 0 0 1 235,317 H165 A6,6 0 0 1 159,311 Z',
    mark: { x: 162, y: 205, w: 76, h: 80 },
  },
  portefeuille: {
    body: rr(60, 105, 280, 190, 12),
    extra: `<line x1="200" y1="105" x2="200" y2="295" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`,
    stitch: inset(60, 105, 280, 190, 12),
    mark: { x: 225, y: 170, w: 90, h: 60 },
  },
  golf: {
    body: 'M120,175 C120,95 280,95 280,175 C280,225 255,250 238,270 V340 H162 V270 C145,250 120,225 120,175 Z',
    extra: `<rect x="162" y="300" width="76" height="40" fill="#000" opacity=".22"/>`,
    stitch: 'M131,175 C131,108 269,108 269,175 C269,220 246,243 229,264 V292 H171 V264 C154,243 131,220 131,175 Z',
    mark: { x: 155, y: 135, w: 90, h: 80 },
  },
  trousse: {
    body: rr(55, 130, 290, 170, 34),
    extra:
      `<path d="M85,150 H315" stroke="${METAL}" stroke-width="5" stroke-dasharray="3 2"/>` +
      `<rect x="290" y="142" width="14" height="34" rx="4" fill="${METAL}"/>`,
    stitch: inset(55, 130, 290, 170, 34, 34),
    mark: { x: 145, y: 200, w: 110, h: 60 },
  },
  'sous-main': {
    body: rr(30, 95, 340, 210, 8),
    extra: `<path d="${rr(48, 113, 304, 174, 4)}" fill="#000" fill-opacity=".08"/>`,
    stitch: inset(30, 95, 340, 210, 8),
    mark: { x: 270, y: 250, w: 74, h: 36 },
  },
  vinyle: {
    body: rr(70, 85, 240, 240, 4),
    under:
      `<circle cx="300" cy="205" r="112" fill="#0d0b0a"/>` +
      `<circle cx="300" cy="205" r="104" fill="none" stroke="#2a2622" stroke-width="1" stroke-dasharray="1 3"/>` +
      `<circle cx="300" cy="205" r="34" fill="#e1be80" opacity=".8"/>`,
    stitch: inset(70, 85, 240, 240, 4),
    mark: { x: 125, y: 170, w: 130, h: 70 },
  },
};

export const shapeOf = (key: string | null | undefined): Shape => SHAPES[key ?? ''] ?? SHAPES['porte-cles'];

/** Miniature statique (cartes de choix), sans filtres ni dégradés. */
export function thumbSvg(key: string, color = '#8a4a24') {
  const s = shapeOf(key);
  return `<svg viewBox="40 60 330 300" aria-hidden="true" focusable="false"><path d="${s.body}" fill="${color}"/><path d="${s.stitch}" fill="none" stroke="#e1be80" stroke-width="2" stroke-dasharray="5 4"/></svg>`;
}
