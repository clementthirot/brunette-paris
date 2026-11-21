import { gsap, reducedMotion } from './motion';
import { playHotStamp } from './hotstamp';
import { shapeOf } from './studio-shapes';

/**
 * Studio cadeaux : logique du configurateur.
 *  - met à jour l'aperçu (silhouette, cuir, fil, logo marqué) et l'estimation à chaque choix ;
 *  - garde la composition dans l'adresse de la page (lien partageable, sans le logo) ;
 *  - envoie le brief au service de formulaire (Réglages globaux › Adresse d'envoi du formulaire)
 *    ou, à défaut, ouvre la messagerie avec le brief rédigé.
 */

type Data = {
  pieces: { nom: string; forme: string; prixMin: number; prixMax: number; quantiteMin: number; delai: number }[];
  cuirs: { nom: string; couleur: string; supplement: number }[];
  fils: { nom: string; couleur: string }[];
  marquages: { nom: string; rendu: string; supplement: number; fixes: number }[];
  paliers: { min: number; remise: number }[];
  afficherPrix: boolean;
  textes: {
    semaines: string;
    alerteQuantite: string;
    copie: string;
    confirmation: string;
    erreur: string;
    messagerie: string;
    envoi: string;
    labels: Record<string, string>;
  };
  endpoint: string;
  email: string;
};

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const range = (a: number, b: number) => (Math.round(a) === Math.round(b) ? euro.format(a) : `${euro.format(a)} – ${euro.format(b)}`);

export function initStudio() {
  const found = document.querySelector<HTMLElement>('[data-studio]');
  if (!found || found.dataset.ready) return;
  const root: HTMLElement = found;
  root.dataset.ready = '';
  const data: Data = JSON.parse(root.querySelector('[data-studio-data]')!.textContent || '{}');

  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const form = $<HTMLFormElement>('[data-studio-form]');
  const stage = $('[data-stage]');
  const mark = $('[data-mark]');
  const body = $<SVGPathElement>('[data-shape-body]');
  const clip = $<SVGPathElement>('[data-shape-clip]');
  const stitch = $<SVGPathElement>('[data-shape-stitch]');
  const under = $<SVGGElement>('[data-shape-under]');
  const extra = $<SVGGElement>('[data-shape-extra]');
  const qtyRange = $<HTMLInputElement>('[data-qty-range]');
  const qtyInput = $<HTMLInputElement>('[data-qty-input]');
  const dateInput = $<HTMLInputElement>('[data-date-input]');
  const textInput = $<HTMLInputElement>('[data-text-input]');
  const logoInput = $<HTMLInputElement>('[data-logo-input]');
  const drop = $('[data-drop]');
  const dropText = $('[data-drop-text]');
  const status = $('[data-status]');
  const submit = $<HTMLButtonElement>('[data-submit]');
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const gotos = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-goto]'));
  const prev = $<HTMLButtonElement>('[data-prev]');
  const next = $<HTMLButtonElement>('[data-next]');

  let logoUrl = '';
  let logoName = '';
  let current = 0;
  let touched = false; // l'adresse n'est réécrite qu'après un premier choix

  // -------------------------------------------------------------------------
  // État
  // -------------------------------------------------------------------------
  const radio = (name: string) => Number((form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value) ?? 0);
  const state = () => {
    const piece = data.pieces[radio('piece')] ?? data.pieces[0];
    const cuir = data.cuirs[radio('cuir')] ?? data.cuirs[0];
    const fil = data.fils[radio('fil')] ?? data.fils[0];
    const marquage = data.marquages[radio('marquage')] ?? data.marquages[0];
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    return { piece, cuir, fil, marquage, qty, texte: textInput.value.trim(), date: dateInput.value };
  };

  function estimate() {
    const { piece, cuir, marquage, qty } = state();
    const remise = data.paliers.filter((p) => qty >= p.min).reduce((r, p) => Math.max(r, p.remise), 0);
    const k = (1 + (cuir?.supplement ?? 0) / 100) * (1 - remise / 100);
    const sup = (marquage?.supplement ?? 0) * (1 - remise / 100);
    const unitMin = piece.prixMin * k + sup;
    const unitMax = piece.prixMax * k + sup;
    const fixes = marquage?.fixes ?? 0;
    const round10 = (n: number) => Math.round(n / 10) * 10;
    const extraWeeks = Math.max(0, Math.ceil(qty / 100) - 1);
    const wMin = piece.delai + extraWeeks;
    return {
      remise,
      unitMin,
      unitMax,
      fixes,
      totalMin: round10(unitMin * qty + fixes),
      totalMax: round10(unitMax * qty + fixes),
      wMin,
      wMax: wMin + 2,
    };
  }

  // -------------------------------------------------------------------------
  // Aperçu
  // -------------------------------------------------------------------------
  let lastForme = '';
  function renderStage(animateShape = false) {
    const { piece, cuir, fil, marquage, texte } = state();
    const shape = shapeOf(piece.forme);
    stage.style.setProperty('--leather', cuir.couleur);
    stage.style.setProperty('--thread', fil?.couleur || `color-mix(in srgb, ${cuir.couleur} 70%, #000)`);
    const render = marquage?.rendu ?? 'sec';
    const key = `${piece.forme}|${render === 'rivet'}`;
    if (key !== lastForme) {
      lastForme = key;
      body.setAttribute('d', shape.body);
      clip.setAttribute('d', shape.body);
      stitch.setAttribute('d', shape.stitch);
      under.innerHTML = shape.under ?? '';
      extra.innerHTML = shape.extra ?? '';
      let { x, y, w, h } = shape.mark;
      if (render === 'rivet') {
        // Le rivet est rond : zone carrée centrée.
        const side = Math.min(w, h);
        x += (w - side) / 2;
        y += (h - side) / 2;
        w = h = side;
      }
      Object.assign(mark.style, { left: `${x / 4}%`, top: `${y / 4}%`, width: `${w / 4}%`, height: `${h / 4}%` });
      if (animateShape && !reducedMotion()) {
        gsap.fromTo(stage.querySelector('svg'), { opacity: 0.3, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', transformOrigin: '50% 50%' });
      }
    }
    mark.dataset.render = marquage?.rendu ?? 'sec';
    if (logoUrl) {
      mark.dataset.kind = 'logo';
      mark.style.setProperty('--logo', `url("${logoUrl}")`);
    } else {
      mark.dataset.kind = 'text';
      const t = texte || 'VOTRE LOGO';
      mark.style.setProperty('--txt', JSON.stringify(t));
      // Taille du texte ajustée à la zone de marquage.
      const box = mark.getBoundingClientRect();
      const fs = Math.min(box.height * 0.5, (box.width / Math.max(t.length, 4)) * 1.75);
      mark.style.setProperty('--mark-fs', `${Math.max(fs, 8)}px`);
    }
    $('[data-stage-caption]').textContent = `${piece.nom} · ${cuir.nom} · ${marquage?.nom ?? ''}`;
    $('[data-stage-title]').textContent = `${piece.nom}, cuir ${cuir.nom}, ${marquage?.nom ?? ''}`;
  }

  function stamp() {
    playHotStamp(mark, 1.2, 0.05);
  }

  // -------------------------------------------------------------------------
  // Estimation et récapitulatif
  // -------------------------------------------------------------------------
  function renderEstimate() {
    const s = state();
    const e = estimate();
    const set = (sel: string, txt: string) => {
      const el = root.querySelector<HTMLElement>(sel);
      if (el) el.textContent = txt;
    };
    if (data.afficherPrix) {
      set('[data-est-unit]', range(e.unitMin, e.unitMax));
      set('[data-est-total]', range(e.totalMin, e.totalMax));
      const fx = root.querySelector<HTMLElement>('[data-est-fixes]');
      if (fx) fx.textContent = e.fixes ? `${fx.dataset.label} : ${euro.format(e.fixes)}` : '';
    }
    set('[data-est-delay]', `${e.wMin} à ${e.wMax} ${data.textes.semaines}`);

    const aq = $('[data-alert-qty]');
    aq.hidden = s.qty >= s.piece.quantiteMin;
    aq.textContent = data.textes.alerteQuantite.replace('{min}', String(s.piece.quantiteMin));

    const ad = $('[data-alert-date]');
    if (s.date) {
      const days = (new Date(s.date).getTime() - Date.now()) / 86_400_000;
      ad.hidden = days >= e.wMin * 7 + 14; // + 2 semaines pour le prototype
    } else ad.hidden = true;

    // Récapitulatif (étape 5, impression, envoi)
    const dl = $('[data-recap]');
    dl.innerHTML = '';
    recapRows().forEach(([k, v]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = k;
      dd.textContent = v;
      dl.append(dt, dd);
    });
  }

  function recapRows(): [string, string][] {
    const s = state();
    const e = estimate();
    const L = data.textes.labels;
    const occasion = (form.elements.namedItem('occasion') as HTMLSelectElement | null)?.value ?? '';
    const rows: [string, string][] = [
      [L.piece, s.piece.nom],
      [L.cuir, s.cuir.nom],
      [L.fil, s.fil?.nom ?? ''],
      [L.marquage, `${s.marquage?.nom ?? ''}${logoName ? ` (logo : ${logoName})` : s.texte ? ` (« ${s.texte} »)` : ''}`],
      [L.quantite, String(s.qty)],
    ];
    if (s.date) rows.push([L.date, new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })]);
    if (occasion) rows.push([L.occasion, occasion]);
    if (data.afficherPrix) {
      rows.push([L.unitaire, `${range(e.unitMin, e.unitMax)} HT`]);
      rows.push([L.total, `${range(e.totalMin, e.totalMax)} HT`]);
    }
    rows.push([L.delai, `${e.wMin} à ${e.wMax} ${data.textes.semaines}`]);
    return rows;
  }

  // -------------------------------------------------------------------------
  // Lien partageable : la composition est gardée dans l'adresse de la page.
  // -------------------------------------------------------------------------
  function writeUrl() {
    const s = state();
    const q = new URLSearchParams();
    q.set('piece', String(radio('piece')));
    q.set('cuir', String(radio('cuir')));
    q.set('fil', String(radio('fil')));
    q.set('marquage', String(radio('marquage')));
    q.set('qte', String(s.qty));
    if (s.texte) q.set('texte', s.texte);
    if (s.date) q.set('date', s.date);
    const occ = (form.elements.namedItem('occasion') as HTMLSelectElement | null)?.value;
    if (occ) q.set('occasion', occ);
    history.replaceState(null, '', `${location.pathname}?${q}${location.hash}`);
  }

  function readUrl() {
    const q = new URLSearchParams(location.search);
    (['piece', 'cuir', 'fil', 'marquage'] as const).forEach((name) => {
      const v = q.get(name);
      const input = v && form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(v)}"]`);
      if (input) input.checked = true;
    });
    if (q.get('qte')) qtyInput.value = String(parseInt(q.get('qte')!, 10) || qtyInput.value);
    if (q.get('texte')) textInput.value = q.get('texte')!.slice(0, 24);
    if (q.get('date')) dateInput.value = q.get('date')!;
    const occ = q.get('occasion');
    const sel = form.elements.namedItem('occasion') as HTMLSelectElement | null;
    if (occ && sel && Array.from(sel.options).some((o) => o.value === occ)) sel.value = occ;
    syncRange();
    // ?etape=1 : composition préremplie mais parcours depuis le début (liens des pages occasion).
    const etape = parseInt(q.get('etape') || '', 10);
    if (etape >= 1) return etape - 1;
    return q.has('piece') ? steps.length - 1 : 0;
  }

  // -------------------------------------------------------------------------
  // Logo : converti en masque (fond clair rendu transparent, marges rognées).
  // -------------------------------------------------------------------------
  async function loadLogo(file: File) {
    const src = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      await img.decode();
      const max = 700;
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
      const w = ratio >= 1 ? max : Math.round(max * ratio);
      const h = ratio >= 1 ? Math.round(max / ratio) : max;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, w, h);
      const px = ctx.getImageData(0, 0, w, h);
      const d = px.data;
      let transparent = false;
      for (let i = 3; i < d.length; i += 16) if (d[i] < 200) { transparent = true; break; }
      // Logo sur fond opaque (JPG, PNG plein) : les zones sombres deviennent la forme marquée.
      if (!transparent) {
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
          d[i + 3] = Math.max(0, Math.min(255, (235 - lum) * 1.6));
        }
      }
      // Rognage des marges vides pour que le logo occupe toute la zone de marquage.
      let x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (d[(y * w + x) * 4 + 3] > 24) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
      if (x1 <= x0 || y1 <= y0) throw new Error('empty');
      // Masque monochrome : seule la transparence compte.
      for (let i = 0; i < d.length; i += 4) { d[i] = d[i + 1] = d[i + 2] = 0; }
      ctx.putImageData(px, 0, 0);
      const out = document.createElement('canvas');
      out.width = x1 - x0 + 1;
      out.height = y1 - y0 + 1;
      out.getContext('2d')!.drawImage(c, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
      logoUrl = out.toDataURL('image/png');
      logoName = file.name;
      dropText.textContent = file.name;
      drop.classList.add('has-file');
    } catch {
      logoUrl = '';
      logoName = '';
      drop.classList.remove('has-file');
    } finally {
      URL.revokeObjectURL(src);
    }
    update(true);
  }

  logoInput.addEventListener('change', () => logoInput.files?.[0] && loadLogo(logoInput.files[0]));
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('is-over');
    const f = e.dataTransfer?.files?.[0];
    if (f && f.type.startsWith('image/')) loadLogo(f);
  });

  // -------------------------------------------------------------------------
  // Étapes
  // -------------------------------------------------------------------------
  function go(i: number, focus = true) {
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => (s.hidden = k !== current));
    gotos.forEach((b, k) => (k === current ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    prev.hidden = current === 0;
    next.hidden = current === steps.length - 1;
    if (focus) {
      const legend = steps[current].querySelector<HTMLElement>('legend');
      legend?.setAttribute('tabindex', '-1');
      legend?.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top + scrollY - 120;
      if (Math.abs(scrollY - top) > 200 && window.innerWidth >= 1024) scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
      if (!reducedMotion()) gsap.fromTo(steps[current], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }
    if (current === 2) stamp();
  }
  gotos.forEach((b, k) => b.addEventListener('click', () => go(k)));
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));

  // -------------------------------------------------------------------------
  // Quantité
  // -------------------------------------------------------------------------
  function syncRange() {
    qtyRange.value = String(Math.min(Number(qtyRange.max), Math.max(1, parseInt(qtyInput.value, 10) || 1)));
  }
  qtyRange.addEventListener('input', () => { qtyInput.value = qtyRange.value; update(); });
  qtyInput.addEventListener('input', () => { syncRange(); update(); });

  // -------------------------------------------------------------------------
  // Mise à jour générale
  // -------------------------------------------------------------------------
  function update(restamp = false, animateShape = false) {
    renderStage(animateShape);
    renderEstimate();
    if (touched) writeUrl();
    if (restamp) stamp();
  }

  form.addEventListener('input', () => (touched = true));
  form.addEventListener('change', (e) => {
    touched = true;
    const t = e.target as HTMLInputElement;
    if (t === logoInput) return;
    if (t.name === 'piece') {
      // Quantité ramenée au minimum de la pièce si elle est en dessous.
      const min = data.pieces[Number(t.value)]?.quantiteMin ?? 1;
      if ((parseInt(qtyInput.value, 10) || 0) < min) { qtyInput.value = String(min); syncRange(); }
      update(true, true);
    } else update(t.name === 'marquage' || t.name === 'cuir');
  });
  let textTimer = 0;
  textInput.addEventListener('input', () => {
    renderStage();
    clearTimeout(textTimer);
    textTimer = window.setTimeout(() => update(true), 450);
  });
  window.addEventListener('resize', () => renderStage());

  // -------------------------------------------------------------------------
  // Partager, imprimer, envoyer
  // -------------------------------------------------------------------------
  $('[data-share]').addEventListener('click', async () => {
    writeUrl();
    try {
      await navigator.clipboard.writeText(location.href);
      info(data.textes.copie);
    } catch {
      info(location.href);
    }
  });
  $('[data-print]').addEventListener('click', () => window.print());

  function info(msg: string) {
    status.classList.add('is-info');
    status.textContent = msg;
  }

  function briefText() {
    const fd = new FormData(form);
    const lines = recapRows().map(([k, v]) => `${k} : ${v}`);
    const who = [fd.get('nom'), fd.get('societe'), fd.get('email'), fd.get('telephone')].filter(Boolean).join(' · ');
    const msg = String(fd.get('message') || '').trim();
    return [...lines, '', who, ...(msg ? ['', msg] : []), '', `Composition : ${location.href}`].join('\n');
  }

  function mailto() {
    if (!data.email) return false;
    const s = state();
    const subject = `Studio cadeaux : ${s.qty} × ${s.piece.nom}`;
    location.href = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText())}`;
    return true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.classList.remove('is-info');
    writeUrl();
    const label = submit.textContent;
    submit.disabled = true;
    submit.textContent = data.textes.envoi;
    try {
      if (!data.endpoint) throw new Error('no-endpoint');
      const fd = new FormData(form);
      const s = state();
      fd.set('piece', s.piece.nom);
      fd.set('cuir', s.cuir.nom);
      fd.set('fil', s.fil?.nom ?? '');
      fd.set('marquage', s.marquage?.nom ?? '');
      fd.set('source', 'Studio cadeaux');
      fd.set('brief', briefText());
      fd.set('_subject', `Studio cadeaux : ${s.qty} × ${s.piece.nom} (${fd.get('societe')})`);
      const res = await fetch(data.endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.classList.add('is-sent');
      status.textContent = data.textes.confirmation;
    } catch (err) {
      // Pas de service d'envoi (ou échec) : la messagerie s'ouvre avec le brief rédigé.
      const noEndpoint = (err as Error).message === 'no-endpoint';
      info(noEndpoint ? data.textes.messagerie : data.textes.erreur);
      mailto();
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });

  // -------------------------------------------------------------------------
  // Démarrage
  // -------------------------------------------------------------------------
  go(readUrl(), false);
  update(false);
  // Premier marquage quand l'aperçu entre à l'écran.
  const io = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting)) {
      stamp();
      io.disconnect();
    }
  }, { threshold: 0.5 });
  io.observe(stage);
}
