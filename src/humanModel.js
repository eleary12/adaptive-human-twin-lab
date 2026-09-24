import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";

const environmentCaptures = {
  rower: [
    { path: "./assets/environments/rower-snow.hdr", label: "Frozen alpine lake" },
    { path: "./assets/environments/rower-fall.hdr", label: "Autumn lakeside" },
    { path: "./assets/environments/rower-summer.hdr", label: "Summer lakeside" },
  ],
  runner: [
    { path: "./assets/environments/runner-desert.hdr", label: "Goegap desert" },
    { path: "./assets/environments/runner-mountain.hdr", label: "Alpine field" },
    { path: "./assets/environments/runner-humid.hdr", label: "Humid flat farmland" },
  ],
  sprinter: [
    { path: "./assets/environments/sprinter-rain.hdr", label: "Overcast wet field" },
    { path: "./assets/environments/sprinter-summer.hdr", label: "Clear track landscape" },
    { path: "./assets/environments/sprinter-winter.hdr", label: "Snow field" },
  ],
};

const boneLinks = [
  ["head", "neck", "head"],
  ["neck", "chest", "torso"],
  ["chest", "pelvis", "torso"],
  ["leftShoulder", "leftElbow", "leftArm"],
  ["leftElbow", "leftHand", "leftArm"],
  ["rightShoulder", "rightElbow", "rightArm"],
  ["rightElbow", "rightHand", "rightArm"],
  ["leftHip", "leftKnee", "leftLeg"],
  ["leftKnee", "leftFoot", "leftLeg"],
  ["rightHip", "rightKnee", "rightLeg"],
  ["rightKnee", "rightFoot", "rightLeg"],
  ["leftShoulder", "rightShoulder", "torso"],
  ["leftHip", "rightHip", "torso"],
];

const skinLinks = [
  ["neck", "chest", "torso", 0.17],
  ["chest", "pelvis", "torso", 0.19],
  ["leftShoulder", "leftElbow", "leftArm", 0.08],
  ["leftElbow", "leftHand", "leftArm", 0.07],
  ["rightShoulder", "rightElbow", "rightArm", 0.08],
  ["rightElbow", "rightHand", "rightArm", 0.07],
  ["leftHip", "leftKnee", "leftLeg", 0.1],
  ["leftKnee", "leftFoot", "leftLeg", 0.085],
  ["rightHip", "rightKnee", "rightLeg", 0.1],
  ["rightKnee", "rightFoot", "rightLeg", 0.085],
];

const neuralPaths = [
  ["brain", "neck", "chest", "pelvis"],
  ["chest", "leftShoulder", "leftElbow", "leftHand"],
  ["chest", "rightShoulder", "rightElbow", "rightHand"],
  ["pelvis", "leftHip", "leftKnee", "leftFoot"],
  ["pelvis", "rightHip", "rightKnee", "rightFoot"],
];

function heatColor(value) {
  const cold = new THREE.Color("#50a4ff");
  const warm = new THREE.Color("#7ff0c1");
  const hot = new THREE.Color("#ff715a");
  if (value < 0.5) return cold.clone().lerp(warm, value / 0.5);
  return warm.clone().lerp(hot, (value - 0.5) / 0.5);
}

function buildBone(radius, material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 18), material);
}

function positionBetween(mesh, from, to) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  mesh.position.copy(midpoint);
  mesh.scale.set(1, length, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

function createBaseLayout(physiology) {
  const body = physiology.bodyScale;
  const shoulders = 0.25 * physiology.shoulderScale * body;
  const hips = 0.145 * physiology.hipScale * body;
  const armReach = 0.5 * physiology.armScale * body;
  const forearmReach = 0.59 * physiology.armScale * body;
  const legLength = physiology.legScale * body;
  return {
    head: new THREE.Vector3(0, 1.57 * body, 0),
    brain: new THREE.Vector3(0, 1.6 * body, 0.01),
    neck: new THREE.Vector3(0, 1.39 * body, 0),
    chest: new THREE.Vector3(0, 1.13 * physiology.torsoScale * body, 0),
    pelvis: new THREE.Vector3(0, 0.78 * physiology.torsoScale * body, 0),
    leftShoulder: new THREE.Vector3(-shoulders, 1.3 * body, 0),
    rightShoulder: new THREE.Vector3(shoulders, 1.3 * body, 0),
    leftElbow: new THREE.Vector3(-armReach, 1.04 * body, 0),
    rightElbow: new THREE.Vector3(armReach, 1.04 * body, 0),
    leftHand: new THREE.Vector3(-forearmReach, 0.76 * body, 0.04),
    rightHand: new THREE.Vector3(forearmReach, 0.76 * body, 0.04),
    leftHip: new THREE.Vector3(-hips, 0.76 * physiology.torsoScale * body, 0),
    rightHip: new THREE.Vector3(hips, 0.76 * physiology.torsoScale * body, 0),
    leftKnee: new THREE.Vector3(-0.18 * body, 0.37 * legLength, 0.03),
    rightKnee: new THREE.Vector3(0.18 * body, 0.37 * legLength, 0.03),
    leftFoot: new THREE.Vector3(-0.18 * body, 0.03, 0.11),
    rightFoot: new THREE.Vector3(0.18 * body, 0.03, 0.11),
  };
}

function animateLayout(layout, state) {
  const physiology = state.athlete.physiology;
  const mode = physiology.animationMode;
  const t = state.motionTime ?? state.gaitPhase ?? state.time;
  const stabilityLean = (1 - state.stability) * 0.08;
  const breath = Math.sin(state.time * 1.6) * 0.018 + (state.coreTemp - 37) * 0.01;

  layout.chest.y += breath;
  layout.neck.y += breath * 0.55;
  layout.head.x += Math.sin(state.time * 0.9) * stabilityLean;
  layout.brain.x = layout.head.x * 0.7;

  if (mode === "row") {
    const stroke = (Math.sin(t * 1.5) + 1) / 2;
    const drive = Math.sin(t * 1.5);
    const seatDrop = 0.24 * physiology.bodyScale;
    const forwardReach = 0.56 - stroke * 0.2;
    const torsoTilt = -0.22 + stroke * 0.44;
    const kneePush = 0.34 + stroke * 0.18;

    layout.pelvis.y -= seatDrop;
    layout.leftHip.y -= seatDrop;
    layout.rightHip.y -= seatDrop;
    layout.chest.y -= seatDrop * 0.68;
    layout.neck.y -= seatDrop * 0.6;
    layout.head.y -= seatDrop * 0.56;
    layout.brain.y -= seatDrop * 0.56;

    layout.chest.z = torsoTilt * 0.72;
    layout.neck.z = torsoTilt * 0.8;
    layout.head.z = torsoTilt * 0.92;
    layout.brain.z = layout.head.z + 0.01;

    layout.leftShoulder.z = torsoTilt * 0.5;
    layout.rightShoulder.z = torsoTilt * 0.5;
    layout.leftElbow.set(-0.18, layout.chest.y - 0.08, 0.34 - stroke * 0.22);
    layout.rightElbow.set(0.18, layout.chest.y - 0.08, 0.34 - stroke * 0.22);
    layout.leftHand.set(-0.12, layout.chest.y - 0.02, forwardReach);
    layout.rightHand.set(0.12, layout.chest.y - 0.02, forwardReach);
    layout.leftKnee.set(-0.22, layout.pelvis.y - 0.24, kneePush);
    layout.rightKnee.set(0.22, layout.pelvis.y - 0.24, kneePush);
    layout.leftFoot.set(-0.22, 0.05, 0.72);
    layout.rightFoot.set(0.22, 0.05, 0.72);
    layout.leftElbow.y += drive * 0.04;
    layout.rightElbow.y += drive * 0.04;
  } else if (mode === "distance") {
    const stride = Math.sin(t * 2.4) * (0.18 + state.velocity * 0.08);
    const armSwing = Math.sin(t * 2.4 + Math.PI) * (0.16 + state.velocity * 0.08);
    layout.chest.z = 0.03 + state.velocity * 0.04;
    layout.neck.z = 0.05 + state.velocity * 0.04;
    layout.head.z = 0.07 + state.velocity * 0.05;
    layout.brain.z = layout.head.z;
    layout.leftElbow.z = armSwing * 0.4;
    layout.rightElbow.z = -armSwing * 0.4;
    layout.leftHand.z += armSwing;
    layout.rightHand.z -= armSwing;
    layout.leftKnee.z += stride * 0.52;
    layout.rightKnee.z -= stride * 0.52;
    layout.leftFoot.z += stride;
    layout.rightFoot.z -= stride;
  } else {
    const stride = Math.sin(t * 3.2) * (0.26 + state.velocity * 0.12);
    const armSwing = Math.sin(t * 3.2 + Math.PI) * (0.18 + state.velocity * 0.14);
    const kneeLift = Math.max(0, Math.sin(t * 3.2)) * 0.14;
    layout.chest.z = 0.12 + state.velocity * 0.08;
    layout.neck.z = 0.16 + state.velocity * 0.08;
    layout.head.z = 0.2 + state.velocity * 0.1;
    layout.brain.z = layout.head.z + 0.01;
    layout.chest.x += stabilityLean * 0.6;
    layout.leftElbow.z = armSwing * 0.46;
    layout.rightElbow.z = -armSwing * 0.46;
    layout.leftHand.z += armSwing * 1.12;
    layout.rightHand.z -= armSwing * 1.12;
    layout.leftKnee.z += stride * 0.55 + kneeLift;
    layout.rightKnee.z -= stride * 0.55 + Math.max(0, -Math.sin(t * 3.2)) * 0.14;
    layout.leftFoot.z += stride * 1.18;
    layout.rightFoot.z -= stride * 1.18;
  }

  return layout;
}

function normalizeScan(root, targetHeight) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center);
  const height = size.y || 1;
  const scale = targetHeight / height;
  root.scale.setScalar(scale);
  root.position.y += targetHeight * 0.5;
}

function prepareScan(scene, targetHeight) {
  const root = cloneSkeleton(scene);
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = false;
    child.receiveShadow = false;
    const material = child.material?.clone?.() ?? child.material;
    if (material) {
      material.transparent = true;
      material.opacity = 0.96;
      material.roughness = material.roughness ?? 0.75;
      material.metalness = material.metalness ?? 0;
      child.material = material;
    }
  });
  normalizeScan(root, targetHeight);
  root.userData.baseY = root.position.y;
  return root;
}

function prepareObj(scene, targetHeight) {
  const bounds = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  bounds.getSize(size);

  // Most architectural OBJ exports are Z-up; rotate only when Z is the dominant body axis.
  if (size.z > size.y * 1.05) {
    scene.rotation.x = -Math.PI / 2;
    scene.updateMatrixWorld(true);
  }

  const root = prepareScan(scene, targetHeight);
  root.traverse((child) => {
    if (!child.isMesh) return;
    if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals();
    const gaitTime = { value: 0 };
    const material = new THREE.MeshStandardMaterial({
      color: "#b98063",
      roughness: 0.64,
      metalness: 0.02,
      transparent: true,
      opacity: 0.97,
    });
    material.userData.gaitTime = gaitTime;
    material.customProgramCacheKey = () => "running-gait-v1";
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uGaitTime = gaitTime;
      shader.vertexShader = `uniform float uGaitTime;\n${shader.vertexShader}`.replace(
        "#include <begin_vertex>",
        `
          vec3 transformed = vec3(position);
          float stride = sin(uGaitTime * 8.4);
          float side = position.x < 0.0 ? -1.0 : 1.0;

          float legWeight = (1.0 - smoothstep(-4.0, 10.0, position.z))
            * smoothstep(5.0, 16.0, abs(position.x));
          float legAngle = side * stride * 0.19 * legWeight;
          vec2 legOffset = vec2(transformed.y, transformed.z + 8.0);
          float legCos = cos(legAngle);
          float legSin = sin(legAngle);
          legOffset = mat2(legCos, -legSin, legSin, legCos) * legOffset;
          transformed.y = mix(transformed.y, legOffset.x, legWeight);
          transformed.z = mix(transformed.z, legOffset.y - 8.0, legWeight);

          float footWeight = 1.0 - smoothstep(-72.0, -54.0, position.z);
          transformed.z += max(0.0, side * stride) * 7.5 * footWeight;

          float armWeight = smoothstep(12.0, 24.0, abs(position.x))
            * smoothstep(8.0, 28.0, position.z)
            * (1.0 - smoothstep(72.0, 88.0, position.z));
          float armAngle = -side * stride * 0.24 * armWeight;
          vec2 armOffset = vec2(transformed.y, transformed.z - 48.0);
          float armCos = cos(armAngle);
          float armSin = sin(armAngle);
          armOffset = mat2(armCos, -armSin, armSin, armCos) * armOffset;
          transformed.y = mix(transformed.y, armOffset.x, armWeight);
          transformed.z = mix(transformed.z, armOffset.y + 48.0, armWeight);
        `
      );
    };
    child.material = material;
  });
  return root;
}

export function createHumanScene(container) {
  const loader = new GLTFLoader();
  const objLoader = new OBJLoader();
  const environmentLoader = new RGBELoader();
  const scanCache = new Map();
  const defaultScanCache = new Map();
  const environmentCache = new Map();
  let activeAthleteId = null;
  let activeScanMixer = null;
  let activeGaitUniforms = [];
  let requestedEnvironmentKey = null;
  let environmentStatus = { state: "loading", label: "Loading environment" };

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#06131a", 0.065);
  scene.backgroundBlurriness = 0.04;
  scene.backgroundIntensity = 0.72;
  scene.environmentIntensity = 0.82;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(2.35, 1.7, 3.3);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.minDistance = 1.7;
  controls.maxDistance = 5.4;
  controls.target.set(0, 0.9, 0);

  scene.add(new THREE.HemisphereLight("#d9ffff", "#10202a", 1.45));
  const keyLight = new THREE.DirectionalLight("#ecffff", 1.25);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight("#68d8ff", 0.8);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);

  const stage = new THREE.Mesh(
    new THREE.CircleGeometry(2.55, 80),
    new THREE.MeshStandardMaterial({ color: "#0a2630", emissive: "#081721", roughness: 0.72, metalness: 0.12 })
  );
  stage.rotation.x = -Math.PI / 2;
  stage.position.y = -0.01;
  scene.add(stage);

  const accentRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.02, 18, 100),
    new THREE.MeshBasicMaterial({ color: "#53c8ff", transparent: true, opacity: 0.42 })
  );
  accentRing.rotation.x = Math.PI / 2;
  accentRing.position.y = 0.015;
  scene.add(accentRing);

  const sceneAccents = {
    water: new THREE.Group(),
    trail: new THREE.Group(),
    track: new THREE.Group(),
  };

  const waterLines = [];
  const waterLineMaterial = new THREE.LineBasicMaterial({ color: "#74cfff", transparent: true, opacity: 0.45 });
  for (let index = 0; index < 4; index += 1) {
    const points = [];
    for (let step = 0; step <= 32; step += 1) points.push(new THREE.Vector3(-1.4 + (step / 32) * 2.8, 0.02, -0.7 + index * 0.36));
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), waterLineMaterial);
    sceneAccents.water.add(line);
    waterLines.push(line);
  }

  const trailPath = [];
  for (let step = 0; step <= 36; step += 1) trailPath.push(new THREE.Vector3(-1.1 + (step / 36) * 2.2, 0.02, Math.sin(step * 0.26) * 0.38));
  sceneAccents.trail.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(trailPath), new THREE.LineBasicMaterial({ color: "#e0bc88", transparent: true, opacity: 0.48 })));

  for (let index = 0; index < 3; index += 1) {
    const lane = new THREE.Mesh(
      new THREE.TorusGeometry(0.95 + index * 0.22, 0.012, 10, 100),
      new THREE.MeshBasicMaterial({ color: "#ffe9dd", transparent: true, opacity: 0.58 })
    );
    lane.rotation.x = Math.PI / 2;
    lane.scale.set(1.22, 0.7, 1);
    lane.position.y = 0.018;
    sceneAccents.track.add(lane);
  }
  Object.values(sceneAccents).forEach((group) => scene.add(group));

  const weatherGeometry = new THREE.BufferGeometry();
  const weatherCount = 320;
  const weatherPositions = new Float32Array(weatherCount * 3);
  weatherGeometry.setAttribute("position", new THREE.BufferAttribute(weatherPositions, 3));
  const weatherMaterial = new THREE.PointsMaterial({ color: "#d8f3ff", size: 0.04, transparent: true, opacity: 0.6 });
  const weatherParticles = new THREE.Points(weatherGeometry, weatherMaterial);
  scene.add(weatherParticles);

  const human = new THREE.Group();
  scene.add(human);

  const skeletonGroup = new THREE.Group();
  const jointsGroup = new THREE.Group();
  const skinGroup = new THREE.Group();
  const neuralGroup = new THREE.Group();
  const scanGroup = new THREE.Group();
  skinGroup.add(scanGroup);
  human.add(skinGroup, skeletonGroup, jointsGroup, neuralGroup);

  const jointMaterial = new THREE.MeshStandardMaterial({ color: "#f2fff9", emissive: "#97ffd9", emissiveIntensity: 0.16, roughness: 0.34, metalness: 0.1 });
  const skeletonMaterial = new THREE.MeshStandardMaterial({ color: "#eff7ff", emissive: "#223344", roughness: 0.46, metalness: 0.2, transparent: true, opacity: 0.95 });
  const skinMaterials = {
    head: new THREE.MeshPhysicalMaterial({ color: "#7dd7bb", roughness: 0.3, metalness: 0.02, transmission: 0.08, transparent: true, opacity: 0.78 }),
    torso: new THREE.MeshPhysicalMaterial({ color: "#7dd7bb", roughness: 0.34, metalness: 0.02, transmission: 0.05, transparent: true, opacity: 0.68 }),
    leftArm: new THREE.MeshPhysicalMaterial({ color: "#7dd7bb", roughness: 0.34, transparent: true, opacity: 0.64 }),
    rightArm: new THREE.MeshPhysicalMaterial({ color: "#7dd7bb", roughness: 0.34, transparent: true, opacity: 0.64 }),
    leftLeg: new THREE.MeshPhysicalMaterial({ color: "#7dd7bb", roughness: 0.34, transparent: true, opacity: 0.66 }),
    rightLeg: new THREE.MeshPhysicalMaterial({ color: "#7dd7bb", roughness: 0.34, transparent: true, opacity: 0.66 }),
  };

  const skinSegments = skinLinks.map(([fromKey, toKey, materialKey, radius]) => {
    const mesh = buildBone(radius, skinMaterials[materialKey]);
    skinGroup.add(mesh);
    return { fromKey, toKey, materialKey, mesh };
  });

  const skeletonSegments = boneLinks.map(([fromKey, toKey, materialKey]) => {
    const radius = materialKey === "torso" ? 0.042 : materialKey === "head" ? 0.05 : 0.028;
    const mesh = buildBone(radius, skeletonMaterial);
    skeletonGroup.add(mesh);
    return { fromKey, toKey, mesh };
  });

  const jointMeshes = {};
  ["head", "neck", "chest", "pelvis", "leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftHand", "rightHand", "leftHip", "rightHip", "leftKnee", "rightKnee", "leftFoot", "rightFoot"].forEach((key) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(key === "head" ? 0.07 : 0.038, 18, 18), jointMaterial);
    jointsGroup.add(mesh);
    jointMeshes[key] = mesh;
  });

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 24), skinMaterials.head);
  const brainMesh = new THREE.Mesh(new THREE.SphereGeometry(0.072, 20, 20), new THREE.MeshStandardMaterial({ color: "#ffd0bb", emissive: "#ff835f", emissiveIntensity: 0.2, transparent: true, opacity: 0.9 }));
  const pelvisMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), skinMaterials.torso);
  const chestMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), skinMaterials.torso);
  const leftHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 18, 18), skinMaterials.leftArm);
  const rightHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 18, 18), skinMaterials.rightArm);
  const leftFootMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 18, 18), skinMaterials.leftLeg);
  const rightFootMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 18, 18), skinMaterials.rightLeg);
  [headMesh, chestMesh, pelvisMesh, leftHandMesh, rightHandMesh, leftFootMesh, rightFootMesh].forEach((mesh) => skinGroup.add(mesh));
  neuralGroup.add(brainMesh);

  const neuralMaterial = new THREE.LineBasicMaterial({ color: "#ffb26e", transparent: true, opacity: 0.82 });
  const neuralLines = neuralPaths.map(() => {
    const line = new THREE.Line(new THREE.BufferGeometry(), neuralMaterial);
    neuralGroup.add(line);
    return line;
  });

  const clearScanGroup = () => {
    activeScanMixer = null;
    activeGaitUniforms = [];
    while (scanGroup.children.length) scanGroup.remove(scanGroup.children[0]);
  };

  const showScan = (athleteId) => {
    clearScanGroup();
    activeAthleteId = athleteId;
    const cached = scanCache.get(athleteId);
    if (!cached) return;
    const instance = cloneSkeleton(cached.root);
    scanGroup.add(instance);
    instance.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material?.userData.gaitTime) activeGaitUniforms.push(material.userData.gaitTime);
      });
    });
    if (cached.clips?.length) {
      const preferredClip = { rower: "Working", runner: "Walk", sprinter: "Run" }[athleteId];
      const clip = cached.clips.find((item) => item.name.includes(preferredClip)) ?? cached.clips[0];
      activeScanMixer = new THREE.AnimationMixer(instance);
      activeScanMixer.clipAction(clip).play();
    }
  };

  const useEnvironmentCapture = (athleteId, phaseIndex) => {
    const capture = environmentCaptures[athleteId]?.[phaseIndex];
    if (!capture) return;
    const key = `${athleteId}-${phaseIndex}`;
    if (requestedEnvironmentKey === key) return;
    requestedEnvironmentKey = key;
    environmentStatus = { state: "loading", label: `Loading ${capture.label}` };

    const applyTexture = (texture) => {
      if (requestedEnvironmentKey !== key) return;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      environmentStatus = { state: "ready", label: capture.label };
    };

    const cached = environmentCache.get(key);
    if (cached) {
      applyTexture(cached);
      return;
    }

    environmentLoader.load(
      capture.path,
      (texture) => {
        environmentCache.set(key, texture);
        applyTexture(texture);
      },
      undefined,
      () => {
        if (requestedEnvironmentKey === key) {
          environmentStatus = { state: "error", label: "Environment capture unavailable" };
        }
      }
    );
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  window.addEventListener("resize", resize);

  return {
    async loadBuiltInHuman(athletes) {
      try {
        const runningModel = await objLoader.loadAsync("./assets/models/11083_Man_Running_v2.obj");
        athletes.forEach((athlete) => {
          const root = prepareObj(runningModel, 1.72 * athlete.physiology.bodyScale);
          const entry = { root, name: "Man Running OBJ", isDefault: true, clips: [] };
          defaultScanCache.set(athlete.id, entry);
          if (!scanCache.has(athlete.id)) scanCache.set(athlete.id, entry);
        });
        if (activeAthleteId) showScan(activeAthleteId);
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Unable to load the built-in human." };
      }
    },

    async loadAthleteScan(athlete, file) {
      try {
        const isObj = file.name.toLowerCase().endsWith(".obj");
        let root;
        let clips = [];
        if (isObj) {
          root = prepareObj(objLoader.parse(await file.text()), 1.72 * athlete.physiology.bodyScale);
        } else {
          const url = URL.createObjectURL(file);
          try {
            const gltf = await loader.loadAsync(url);
            root = prepareScan(gltf.scene, 1.72 * athlete.physiology.bodyScale);
            clips = gltf.animations;
          } finally {
            URL.revokeObjectURL(url);
          }
        }
        scanCache.set(athlete.id, { root, name: file.name, clips });
        showScan(athlete.id);
        return { ok: true, name: file.name };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Unable to read this model file." };
      }
    },

    clearAthleteScan(athleteId) {
      const fallback = defaultScanCache.get(athleteId);
      if (fallback) scanCache.set(athleteId, fallback);
      else scanCache.delete(athleteId);
      if (activeAthleteId === athleteId) showScan(athleteId);
    },

    getScanStatus(athleteId) {
      return scanCache.get(athleteId)?.name ?? null;
    },

    getEnvironmentStatus() {
      return environmentStatus;
    },

    setActiveAthlete(athleteId) {
      showScan(athleteId);
    },

    render(state, layers) {
      const env = state.environment ?? state.segment;
      useEnvironmentCapture(state.athlete.id, state.phaseIndex);
      const layout = animateLayout(createBaseLayout(state.athlete.physiology), state);
      const zoneColors = {
        head: heatColor(state.heatZones.head),
        torso: heatColor(state.heatZones.torso),
        leftArm: heatColor(state.heatZones.leftArm),
        rightArm: heatColor(state.heatZones.rightArm),
        leftLeg: heatColor(state.heatZones.leftLeg),
        rightLeg: heatColor(state.heatZones.rightLeg),
      };

      const hasScan = Boolean(scanCache.get(state.athlete.id));
      skinGroup.visible = layers.skin;
      scanGroup.visible = layers.skin && hasScan;
      // The procedural rig is only a fallback; never draw it beneath an imported body.
      skeletonGroup.visible = layers.skeleton && !hasScan;
      jointsGroup.visible = layers.joints && !hasScan;
      neuralGroup.visible = layers.neural && !hasScan;

      headMesh.visible = !hasScan;
      chestMesh.visible = !hasScan;
      pelvisMesh.visible = !hasScan;
      leftHandMesh.visible = !hasScan;
      rightHandMesh.visible = !hasScan;
      leftFootMesh.visible = !hasScan;
      rightFootMesh.visible = !hasScan;
      skinSegments.forEach(({ mesh }) => {
        mesh.visible = !hasScan;
      });

      sceneAccents.water.visible = state.athlete.scene === "water";
      sceneAccents.trail.visible = state.athlete.scene === "trail";
      sceneAccents.track.visible = state.athlete.scene === "track";
      scene.fog.density = 0.045 + env.precipitationIntensity * 0.04 + (1 - env.airQuality) * 0.05;

      if (state.athlete.scene === "water") {
        stage.material.color.set(env.temperature > 24 ? "#15343c" : env.precipitationType === "snow" ? "#0a1d2b" : "#102b36");
        accentRing.material.color.set(env.temperature > 24 ? "#8af7d4" : env.precipitationType === "snow" ? "#92d8ff" : "#f6bf72");
        waterLines.forEach((line, index) => {
          const points = [];
          for (let step = 0; step <= 32; step += 1) {
            const x = -1.4 + (step / 32) * 2.8;
            const z = -0.7 + index * 0.36 + Math.sin(step * 0.42 + state.motionTime * 2.1 + index) * (0.02 + env.wind * 0.07);
            points.push(new THREE.Vector3(x, 0.02, z));
          }
          line.geometry.setFromPoints(points);
        });
      } else if (state.athlete.scene === "trail") {
        stage.material.color.set(env.temperature > 32 ? "#3a2714" : env.terrainGrade > 0.1 ? "#17303a" : "#24372d");
        accentRing.material.color.set(env.temperature > 32 ? "#ffb66c" : env.terrainGrade > 0.1 ? "#8fd6ff" : "#9cf0b8");
      } else {
        stage.material.color.set(env.precipitationType === "snow" ? "#112334" : env.precipitationType === "rain" ? "#1a2636" : "#402a1f");
        accentRing.material.color.set(env.precipitationType === "snow" ? "#a6d8ff" : env.precipitationType === "rain" ? "#7acbff" : "#ffab5b");
      }

      Object.entries(jointMeshes).forEach(([key, mesh]) => {
        mesh.position.copy(layout[key]);
      });
      skeletonSegments.forEach(({ fromKey, toKey, mesh }) => {
        positionBetween(mesh, layout[fromKey], layout[toKey]);
      });
      skinSegments.forEach(({ fromKey, toKey, materialKey, mesh }) => {
        positionBetween(mesh, layout[fromKey], layout[toKey]);
        mesh.material.color.copy(zoneColors[materialKey]);
      });

      headMesh.position.copy(layout.head);
      headMesh.scale.set(0.92, 1.12, 0.94);
      headMesh.material.color.copy(zoneColors.head);
      brainMesh.position.copy(layout.brain);
      brainMesh.material.emissiveIntensity = 0.16 + (1 - state.cognition) * 0.28;
      chestMesh.position.copy(layout.chest);
      chestMesh.scale.set(state.athlete.physiology.shoulderScale * 1.38, state.athlete.physiology.torsoScale * 1.2, 1);
      chestMesh.material.color.copy(zoneColors.torso);
      pelvisMesh.position.copy(layout.pelvis);
      pelvisMesh.scale.set(state.athlete.physiology.hipScale * 1.25, 0.9, 1);
      pelvisMesh.material.color.copy(zoneColors.torso);
      leftHandMesh.position.copy(layout.leftHand);
      rightHandMesh.position.copy(layout.rightHand);
      leftFootMesh.position.copy(layout.leftFoot);
      rightFootMesh.position.copy(layout.rightFoot);
      leftHandMesh.material.color.copy(zoneColors.leftArm);
      rightHandMesh.material.color.copy(zoneColors.rightArm);
      leftFootMesh.material.color.copy(zoneColors.leftLeg);
      rightFootMesh.material.color.copy(zoneColors.rightLeg);

      neuralLines.forEach((line, index) => {
        line.geometry.setFromPoints(neuralPaths[index].map((key) => layout[key]));
      });

      if (hasScan) {
        const scanRoot = scanGroup.children[0];
        if (scanRoot) {
          const gaitTime = state.motionTime ?? state.time;
          activeScanMixer?.setTime(gaitTime * (state.athlete.id === "sprinter" ? 1.35 : 0.85));
          activeGaitUniforms.forEach((uniform) => {
            uniform.value = gaitTime;
          });
          scanRoot.rotation.y = Math.sin(gaitTime * 0.65) * 0.045;
          scanRoot.rotation.z = (1 - state.stability) * 0.06;
          scanRoot.position.y = (scanRoot.userData.baseY ?? 0) + Math.abs(Math.sin(gaitTime * 8.4)) * 0.018;
        }
      }

      for (let index = 0; index < weatherCount; index += 1) {
        const offset = index * 3;
        const span = 2.8;
        const seed = index * 0.173;
        weatherPositions[offset] = ((index % 20) / 19 - 0.5) * span * 1.25 + Math.sin(seed + state.time * 0.4) * env.wind * 0.45;
        weatherPositions[offset + 1] = ((index * 0.37 + state.time * (env.precipitationType === "snow" ? 0.35 : 1.4)) % 1) * 2.4;
        weatherPositions[offset + 2] = (((Math.floor(index / 20) / 15) - 0.5) * 2.3) + Math.cos(seed * 3.4) * 0.1;
      }
      weatherGeometry.attributes.position.needsUpdate = true;
      weatherParticles.visible = env.precipitationIntensity > 0.04;
      weatherMaterial.opacity = 0.18 + env.precipitationIntensity * 0.55;
      weatherMaterial.size = env.precipitationType === "snow" ? 0.055 : 0.028;
      weatherMaterial.color.set(env.precipitationType === "snow" ? "#f2fbff" : "#8bd1ff");

      jointMaterial.emissiveIntensity = 0.12 + (1 - state.stability) * 0.22;
      neuralMaterial.color.set(state.cognition < 0.65 ? "#ff9c70" : "#ffd8ab");
      neuralMaterial.opacity = 0.7 + state.mentalLoad * 0.18;

      human.rotation.y = Math.sin(state.time * 0.24) * 0.08;
      human.rotation.z = (1 - state.stability) * 0.18;
      controls.update();
      renderer.render(scene, camera);
    },
  };
}
