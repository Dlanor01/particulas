import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// Criar a cena 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

// Criar a câmera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 650;

// Criar o renderizador
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// Ler o desenho SVG
const path = document.querySelector("#desenho path");
const length = path.getTotalLength();
const vertices = [];

// Criar material das partículas
const material = new THREE.MeshBasicMaterial({
  color: 0xc66aff
});

// Geometria compartilhada entre as partículas
const geometry = new THREE.SphereGeometry(1.8, 6, 6);

// Criar a timeline de animação
const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 1
});

// Gerar as partículas ao longo do SVG
for (let i = 0; i < length; i += 3) {
  const point = path.getPointAtLength(i);

  const vector = new THREE.Vector3(
    (point.x - 300) * 1.1,
    -(point.y - 276) * 1.1,
    0
  );

  vector.x += (Math.random() - 0.5) * 30;
  vector.y += (Math.random() - 0.5) * 30;
  vector.z += (Math.random() - 0.5) * 70;

  vertices.push(vector);

  // Criar a partícula fora da posição final
  const particle = new THREE.Mesh(geometry, material);

  particle.position.set(
    (Math.random() - 0.5) * 1000,
    (Math.random() - 0.5) * 800,
    (Math.random() - 0.5) * 500
  );

  scene.add(particle);

  // Animar a partícula até o desenho
  tl.to(
    particle.position,
    {
      x: vector.x,
      y: vector.y,
      z: vector.z,
      duration: gsap.utils.random(2, 5),
      ease: "power2.inOut"
    },
    0
  );
}

// Renderizar continuamente
function animate() {
  requestAnimationFrame(animate);

  scene.rotation.y = Math.sin(Date.now() * 0.0003) * 0.12;

  renderer.render(scene, camera);
}

animate();

// Ajustar a tela ao redimensionar a janela
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});