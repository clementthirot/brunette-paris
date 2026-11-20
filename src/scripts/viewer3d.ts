/**
 * Visionneuse 3D réutilisable.
 * Charge le fichier .glb déclaré dans Keystatic pour une pièce ; tant qu'aucun fichier
 * n'est fourni, affiche une forme simple (cube, sphère, tore, capsule).
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

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
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

  const placeholderMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a33, roughness: 0.55, metalness: 0.05 });
  function placeholder(shape?: string | null): THREE_NS.Object3D {
    let geo: THREE_NS.BufferGeometry;
    switch (shape) {
      case 'sphere': geo = new THREE.SphereGeometry(1, 64, 64); break;
      case 'torus': geo = new THREE.TorusGeometry(0.85, 0.3, 48, 128); break;
      case 'capsule': geo = new THREE.CapsuleGeometry(0.55, 1.1, 16, 48); break;
      default: geo = new THREE.BoxGeometry(1.5, 1.5, 1.5, 4, 4, 4);
    }
    return new THREE.Mesh(geo, placeholderMaterial);
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
