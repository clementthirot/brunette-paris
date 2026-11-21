/**
 * Visionneuse 3D réutilisable.
 * Charge le fichier .glb déclaré dans Keystatic pour une pièce ; tant qu'aucun fichier
 * n'est fourni, affiche une forme provisoire « en cuir » : peau grainée procédurale,
 * points de couture sellier sable et rivet doré (cube → pochette, sphère, tore, capsule).
 * Sans WebGL, la visionneuse affiche un message sobre au lieu d'un cadre vide.
 * Remplacer le modèle = déposer le .glb dans Keystatic : aucun changement de code.
 *
 * Utilisation : <div data-viewer data-model="/models/x.glb" data-shape="cube" data-autorotate></div>
 * Changer de pièce : el.dispatchEvent(new CustomEvent('viewer:load', { detail: { model, shape } }))
 */
import type * as THREE_NS from 'three';

type Source = { model?: string | null; shape?: string | null };

export async function mountViewer(el: HTMLElement) {
  if (el.dataset.viewerReady) return;
  el.dataset.viewerReady = '1';

  const THREE = await import('three');
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer: THREE_NS.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (err) {
    console.warn('[viewer3d] WebGL indisponible :', err);
    el.classList.add('is-fallback');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  const canvas = renderer.domElement;
  canvas.className = 'viewer__canvas';
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.5, 5.5);

  // Lumière chaude principale + contre-jour sable
  const key = new THREE.DirectionalLight(0xfff1dd, 1.6);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(0xe1be80, 1.2);
  rim.position.set(-4, 2, -3);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = el.hasAttribute('data-autorotate') && !reduced;
  controls.autoRotateSpeed = 0.8; // rotation lente
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.8;

  const pivot = new THREE.Group();
  scene.add(pivot);
  const loader = new GLTFLoader();

  // --- Forme provisoire « en cuir » ------------------------------------------
  /** Grain pleine fleur procédural (cellules irrégulières) : sert de relief et de rugosité. */
  function leatherTexture() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 5200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 2 + Math.random() * 5;
      const g = 110 + Math.random() * 90;
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + Math.random() * 0.5), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }
  const grain = leatherTexture();
  const leather = new THREE.MeshStandardMaterial({
    color: 0x6e4129,
    roughness: 0.78,
    metalness: 0,
    bumpMap: grain,
    bumpScale: 0.55,
    side: THREE.DoubleSide,
  });
  const thread = new THREE.MeshStandardMaterial({ color: 0xe1be80, roughness: 0.5 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xd9b46c, roughness: 0.28, metalness: 1 });

  /** Rectangle arrondi dans le plan XY (contour de couture). */
  function roundedRect(w: number, h: number, r: number) {
    const path = new THREE.Shape();
    path.moveTo(-w / 2 + r, -h / 2);
    path.lineTo(w / 2 - r, -h / 2);
    path.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    path.lineTo(w / 2, h / 2 - r);
    path.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    path.lineTo(-w / 2 + r, h / 2);
    path.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    path.lineTo(-w / 2, -h / 2 + r);
    path.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return path;
  }
  const stitchGeo = new THREE.CapsuleGeometry(0.008, 0.032, 2, 6).rotateZ(Math.PI / 2);
  /** Points de couture sellier (un point tous les 7 mm à l'échelle du modèle) le long d'un contour XY, à la profondeur z. */
  function stitches(path: THREE_NS.Path, z: number) {
    const count = Math.round(path.getLength() / 0.07);
    const mesh = new THREE.InstancedMesh(stitchGeo, thread, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const axis = new THREE.Vector3(0, 0, 1);
    const one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const p = path.getPointAt(t);
      const tan = path.getTangentAt(t);
      q.setFromAxisAngle(axis, Math.atan2(tan.y, tan.x));
      m.compose(new THREE.Vector3(p.x, p.y, z), q, one);
      mesh.setMatrixAt(i, m);
    }
    return mesh;
  }
  /** Couture circulaire autour d'un cylindre vertical (ceinture roulée). */
  function ringStitches(radius: number, y: number) {
    const count = Math.round((Math.PI * 2 * radius) / 0.07);
    const mesh = new THREE.InstancedMesh(stitchGeo, thread, count);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      q.setFromAxisAngle(up, -a + Math.PI / 2);
      m.compose(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius), q, one);
      mesh.setMatrixAt(i, m);
    }
    return mesh;
  }
  function rivet(x: number, y: number, z: number, r = 0.075) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.04, 48), brass);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    return mesh;
  }

  /**
   * Formes provisoires, une par famille de pièces (choix « Forme provisoire 3D » dans Keystatic) :
   * cube → pochette / maroquinerie plate, capsule → étui allongé,
   * tore → ceinture roulée, sphère → porte-clés.
   */
  function placeholder(shape?: string | null): THREE_NS.Object3D {
    const group = new THREE.Group();
    switch (shape) {
      case 'sphere': {
        // Porte-clés : médaillon de cuir piqué, anneau laiton
        const R = 0.62, T = 0.09;
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(R, R, T, 96), leather);
        disc.rotation.x = Math.PI / 2;
        group.add(disc);
        const circle = new THREE.Path().absarc(0, 0, R - 0.08, 0, Math.PI * 2, false);
        group.add(stitches(circle, T / 2 + 0.002), stitches(circle, -T / 2 - 0.002));
        group.add(rivet(0, R - 0.16, T / 2 + 0.02, 0.05));
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 24, 96), brass);
        ring.position.set(0, R + 0.2, 0);
        ring.rotation.y = Math.PI / 2;
        group.add(ring);
        break;
      }
      case 'torus': {
        // Ceinture roulée : deux spires de sangle, couture sur les deux rives, passant laiton
        const H = 0.34;
        [0.8, 0.66].forEach((r) => {
          const band = new THREE.Mesh(new THREE.CylinderGeometry(r, r, H, 160, 1, true), leather);
          group.add(band);
          group.add(ringStitches(r + 0.004, H / 2 - 0.05), ringStitches(r + 0.004, -H / 2 + 0.05));
        });
        const buckle = new THREE.Mesh(new RoundedBoxGeometry(0.3, H + 0.08, 0.05, 3, 0.02), brass);
        buckle.position.set(0, 0, 0.83);
        group.add(buckle);
        group.rotation.x = 0.35;
        break;
      }
      case 'capsule': {
        // Étui allongé (golf, lunettes, stylos) : corps arrondi, couture périmétrique, rivet
        const W = 0.62, H = 1.6, D = 0.3;
        group.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.14), leather));
        const seam = roundedRect(W - 0.14, H - 0.14, 0.1);
        group.add(stitches(seam, D / 2 + 0.002), stitches(seam, -D / 2 - 0.002));
        group.add(rivet(0, H / 2 - 0.22, D / 2 + 0.02, 0.05));
        break;
      }
      default: {
        // Pochette : corps arrondi, rabat, couture sellier sur les deux faces et rivet doré.
        const W = 1.7, H = 1.15, D = 0.42;
        group.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, 0.16), leather));
        const flap = new THREE.Mesh(new RoundedBoxGeometry(W * 0.98, H * 0.46, 0.05, 4, 0.025), leather);
        flap.position.set(0, H * 0.24, D / 2 + 0.02);
        group.add(flap);
        const seam = roundedRect(W - 0.22, H - 0.22, 0.12);
        group.add(stitches(seam, D / 2 + 0.002), stitches(seam, -D / 2 - 0.002));
        const flapStitch = stitches(roundedRect(W * 0.98 - 0.14, H * 0.46 - 0.12, 0.04), 0);
        flapStitch.position.set(0, H * 0.24, D / 2 + 0.047);
        group.add(flapStitch);
        group.add(rivet(0, H * 0.04, D / 2 + 0.06));
      }
    }
    return group;
  }

  // Ombre portée douce sous l'objet (dégradé radial sur un plan)
  {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(0,0,0,0.38)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.9;
    scene.add(shadow);
  }

  /** Centre et met à l'échelle n'importe quel modèle pour qu'il tienne dans le cadre. */
  function fit(obj: THREE_NS.Object3D) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 1.55 / Math.max(size.x, size.y, size.z || 1);
    obj.position.sub(center.multiplyScalar(scale));
    obj.scale.setScalar(scale);
  }

  async function build(src: Source): Promise<THREE_NS.Object3D> {
    if (src.model) {
      try {
        const gltf = await loader.loadAsync(src.model);
        return gltf.scene;
      } catch (err) {
        console.warn('[viewer3d] Modèle introuvable, forme provisoire affichée :', src.model, err);
      }
    }
    return placeholder(src.shape);
  }

  let current: THREE_NS.Object3D | null = null;
  let loadId = 0;
  async function load(src: Source) {
    const id = ++loadId;
    canvas.style.opacity = '0'; // fondu sortant
    const [obj] = await Promise.all([build(src), new Promise((r) => setTimeout(r, reduced ? 0 : 350))]);
    if (id !== loadId) return;
    if (current) pivot.remove(current);
    const wrapper = new THREE.Group();
    wrapper.add(obj);
    fit(obj);
    current = wrapper;
    pivot.add(wrapper);
    controls.reset();
    canvas.style.opacity = '1'; // fondu entrant
  }

  function resize() {
    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(el);
  resize();

  // Rendu uniquement quand la visionneuse est visible
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(el);
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    controls.update();
    renderer.render(scene, camera);
  });

  el.addEventListener('viewer:load', (e) => load((e as CustomEvent<Source>).detail));
  // L'indication « glisser pour tourner » s'efface dès la première prise en main.
  canvas.addEventListener('pointerdown', () => el.classList.add('is-touched'), { once: true });
  await load({ model: el.dataset.model || null, shape: el.dataset.shape || 'cube' });
  el.classList.add('is-ready');
}

/** Monte chaque visionneuse lorsqu'elle approche de l'écran (Three.js chargé à la demande). */
export function initViewers() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        io.unobserve(e.target);
        mountViewer(e.target as HTMLElement);
      }
    }),
    { rootMargin: '200px' }
  );
  document.querySelectorAll<HTMLElement>('[data-viewer]').forEach((el) => io.observe(el));
}
