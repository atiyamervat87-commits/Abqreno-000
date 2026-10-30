/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Pre-allocated scratch objects outside animation loop for Zero GC
const _vec3 = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3(0, 1.2, 0);

interface ThreeSceneProps {
  activeTab?: string;
  adminUnlocked?: boolean;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ adminUnlocked = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // UI State
  const [activeModel, setActiveModel] = useState<'neural_core' | 'architecture' | 'vault'>('neural_core');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [lightingPreset, setLightingPreset] = useState<'cyber' | 'studio' | 'gold'>('cyber');

  // Mutable refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  
  // Interactive pointer rotation
  const pointerRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isDown: boolean; lastX: number; lastY: number }>({
    x: 0,
    y: 0,
    targetX: 0.3,
    targetY: 0.2,
    isDown: false,
    lastX: 0,
    lastY: 0
  });

  // Track exploded ratio in ref for 60fps tick
  const explodedRef = useRef<number>(0);
  explodedRef.current = explodedRatio;

  const wireframeRef = useRef<boolean>(false);
  wireframeRef.current = wireframe;

  const speedRef = useRef<number>(1);
  speedRef.current = rotationSpeed;

  const activeModelRef = useRef<'neural_core' | 'architecture' | 'vault'>('neural_core');
  activeModelRef.current = activeModel;

  const adminUnlockedRef = useRef<boolean>(false);
  adminUnlockedRef.current = adminUnlocked;

  // Build Procedural Textures with Canvas & SRGBColorSpace
  const createProceduralDialTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark cyber background
      ctx.fillStyle = '#060d17';
      ctx.fillRect(0, 0, 512, 512);

      // Concentric markings
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(256, 256, 230, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(256, 256, 200, 0, Math.PI * 2);
      ctx.stroke();

      // Tick marks
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const r1 = i % 5 === 0 ? 210 : 220;
        const r2 = 230;
        ctx.beginPath();
        ctx.moveTo(256 + Math.cos(angle) * r1, 256 + Math.sin(angle) * r1);
        ctx.lineTo(256 + Math.cos(angle) * r2, 256 + Math.sin(angle) * r2);
        ctx.strokeStyle = i % 5 === 0 ? '#38bdf8' : '#1e293b';
        ctx.stroke();
      }

      // Arabic Engraving: 01153747612 & عبقرينو
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('عبقرينو STUDIO', 256, 220);
      ctx.font = '20px monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('01153747612', 256, 280);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.04);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(_targetLookAt);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmicToneMapping & PBR standards
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Environment via PMREMGenerator & RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig: Warm Key Light + Cool Hemisphere Fill
    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.2); // Warm 3200K key
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2); // Cool sky, deep slate ground
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8); // Cyan rim light
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Ground Contact Shadow & Studio Pedestal
    const groundShadowGeo = new THREE.PlaneGeometry(8, 8);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(canvas);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Decorative Ground Tech Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x0284c7, 0x1e293b);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // 6. Root Model Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    groupRef.current = rootGroup;

    // Track subparts for exploded view
    let subParts: { mesh: THREE.Object3D; basePos: THREE.Vector3; explodeDir: THREE.Vector3 }[] = [];

    // Helper: Build Procedural Composite Models
    const rebuildModel = () => {
      // Clear previous model children
      while (rootGroup.children.length > 0) {
        const obj = rootGroup.children[0];
        rootGroup.remove(obj);
      }
      subParts = [];

      const current = activeModelRef.current;
      const dialTexture = createProceduralDialTexture();

      if (current === 'neural_core') {
        // MODEL A: 10-Part Abqarino Neural Core
        // 1. Pedestal Base (Primary silhouette)
        const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 32);
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.9,
          roughness: 0.2,
          bumpScale: 0.05
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.1;
        base.receiveShadow = true;
        rootGroup.add(base);
        subParts.push({ mesh: base, basePos: base.position.clone(), explodeDir: new THREE.Vector3(0, -0.6, 0) });

        // 2. Core Octahedron Quantum Crystal
        const crystalGeo = new THREE.OctahedronGeometry(0.75, 0);
        const crystalMat = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.45,
          roughness: 0.1,
          metalness: 0.1,
          transmission: 0.85,
          ior: 1.52,
          thickness: 0.8
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.y = 1.5;
        crystal.castShadow = true;
        rootGroup.add(crystal);
        subParts.push({ mesh: crystal, basePos: crystal.position.clone(), explodeDir: new THREE.Vector3(0, 0.4, 0) });

        // 3. Inner Gyro Ring (Gold metallic, roughness 0.2)
        const innerRingGeo = new THREE.TorusGeometry(1.1, 0.045, 16, 64);
        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.95,
          roughness: 0.2
        });
        const innerRing = new THREE.Mesh(innerRingGeo, goldMat);
        innerRing.position.y = 1.5;
        innerRing.rotation.x = Math.PI / 4;
        rootGroup.add(innerRing);
        subParts.push({ mesh: innerRing, basePos: innerRing.position.clone(), explodeDir: new THREE.Vector3(0.5, 0.2, 0) });

        // 4. Middle Gyro Ring (Blued Titanium, roughness 0.35)
        const midRingGeo = new THREE.TorusGeometry(1.35, 0.05, 16, 64);
        const titaniumMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          metalness: 0.85,
          roughness: 0.35
        });
        const midRing = new THREE.Mesh(midRingGeo, titaniumMat);
        midRing.position.y = 1.5;
        midRing.rotation.y = Math.PI / 3;
        rootGroup.add(midRing);
        subParts.push({ mesh: midRing, basePos: midRing.position.clone(), explodeDir: new THREE.Vector3(-0.5, 0.4, 0) });

        // 5. Outer Dial Ring with Procedural Markings
        const outerRingGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.08, 48, 1, true);
        const dialMat = new THREE.MeshStandardMaterial({
          map: dialTexture,
          metalness: 0.7,
          roughness: 0.3,
          side: THREE.DoubleSide
        });
        const outerRing = new THREE.Mesh(outerRingGeo, dialMat);
        outerRing.position.y = 1.5;
        rootGroup.add(outerRing);
        subParts.push({ mesh: outerRing, basePos: outerRing.position.clone(), explodeDir: new THREE.Vector3(0, 0.8, 0) });

        // 6-9. 4 Emitter Pylons (Accents)
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const pylonGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.0, 12);
          const pylonMat = new THREE.MeshStandardMaterial({
            color: 0x475569,
            metalness: 0.9,
            roughness: 0.25
          });
          const pylon = new THREE.Mesh(pylonGeo, pylonMat);
          const px = Math.cos(angle) * 1.3;
          const pz = Math.sin(angle) * 1.3;
          pylon.position.set(px, 0.6, pz);
          pylon.castShadow = true;
          rootGroup.add(pylon);
          subParts.push({
            mesh: pylon,
            basePos: pylon.position.clone(),
            explodeDir: new THREE.Vector3(px * 0.8, 0, pz * 0.8)
          });
        }
      } else if (current === 'architecture') {
        // MODEL B: 8-Part Cloud Microservice Architecture
        // 1. Central API Gateway Cylinder (Glass & Chrome)
        const gatewayGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.4, 24);
        const gatewayMat = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transmission: 0.85,
          roughness: 0.1,
          metalness: 0.2,
          thickness: 0.5
        });
        const gateway = new THREE.Mesh(gatewayGeo, gatewayMat);
        gateway.position.set(0, 0.9, 0);
        gateway.castShadow = true;
        rootGroup.add(gateway);
        subParts.push({ mesh: gateway, basePos: gateway.position.clone(), explodeDir: new THREE.Vector3(0, 0.8, 0) });

        // 2-5. 4 Microservice Database Blocks (Stepped beveled monoliths)
        const serviceColors = [0x10b981, 0x6366f1, 0xf59e0b, 0xec4899];
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
          const srvGroup = new THREE.Group();
          const bodyGeo = new THREE.BoxGeometry(0.65, 0.8, 0.65);
          const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.8,
            roughness: 0.25
          });
          const body = new THREE.Mesh(bodyGeo, bodyMat);
          body.position.y = 0.4;
          body.castShadow = true;
          srvGroup.add(body);

          // Glowing LED status strip
          const ledGeo = new THREE.BoxGeometry(0.68, 0.08, 0.68);
          const ledMat = new THREE.MeshStandardMaterial({
            color: serviceColors[i],
            emissive: serviceColors[i],
            emissiveIntensity: 0.8
          });
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.y = 0.55;
          srvGroup.add(led);

          const px = Math.cos(angle) * 1.6;
          const pz = Math.sin(angle) * 1.6;
          srvGroup.position.set(px, 0, pz);
          rootGroup.add(srvGroup);
          subParts.push({
            mesh: srvGroup,
            basePos: srvGroup.position.clone(),
            explodeDir: new THREE.Vector3(px * 0.7, 0, pz * 0.7)
          });
        }

        // 6. Base Foundation bus
        const foundationGeo = new THREE.BoxGeometry(3.6, 0.15, 3.6);
        const foundationMat = new THREE.MeshStandardMaterial({
          color: 0x090d16,
          metalness: 0.9,
          roughness: 0.15
        });
        const foundation = new THREE.Mesh(foundationGeo, foundationMat);
        foundation.position.y = 0.075;
        foundation.receiveShadow = true;
        rootGroup.add(foundation);
        subParts.push({ mesh: foundation, basePos: foundation.position.clone(), explodeDir: new THREE.Vector3(0, -0.4, 0) });
      } else {
        // MODEL C: 9-Part Delivery Stronghold Vault (01153747612)
        // 1. Vault Outer Frame
        const frameGeo = new THREE.BoxGeometry(2.4, 2.4, 0.4);
        const frameMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.95,
          roughness: 0.2
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(0, 1.3, 0);
        frame.castShadow = true;
        rootGroup.add(frame);
        subParts.push({ mesh: frame, basePos: frame.position.clone(), explodeDir: new THREE.Vector3(0, 0, -0.5) });

        // 2. Heavy Circular Vault Door
        const doorGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.35, 36);
        doorGeo.rotateX(Math.PI / 2);
        const doorMat = new THREE.MeshStandardMaterial({
          color: adminUnlockedRef.current ? 0x059669 : 0x0284c7,
          metalness: 0.9,
          roughness: 0.15
        });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 1.3, 0.2);
        door.castShadow = true;
        rootGroup.add(door);
        subParts.push({ mesh: door, basePos: door.position.clone(), explodeDir: new THREE.Vector3(0, 0, 0.8) });

        // 3. Dial Center with Wallet Phone Engraving
        const dialGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
        dialGeo.rotateX(Math.PI / 2);
        const dialMat = new THREE.MeshStandardMaterial({
          map: dialTexture,
          metalness: 0.8,
          roughness: 0.2
        });
        const dial = new THREE.Mesh(dialGeo, dialMat);
        dial.position.set(0, 1.3, 0.42);
        rootGroup.add(dial);
        subParts.push({ mesh: dial, basePos: dial.position.clone(), explodeDir: new THREE.Vector3(0, 0, 1.2) });

        // 4-7. 4 Locking Titanium Bolts
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const boltGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
          const boltMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.95,
            roughness: 0.1
          });
          const bolt = new THREE.Mesh(boltGeo, boltMat);
          const bx = Math.cos(angle) * 0.95;
          const by = 1.3 + Math.sin(angle) * 0.95;
          bolt.position.set(bx, by, 0.25);
          bolt.rotation.z = angle + Math.PI / 2;
          rootGroup.add(bolt);
          subParts.push({
            mesh: bolt,
            basePos: bolt.position.clone(),
            explodeDir: new THREE.Vector3(Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 0.4)
          });
        }
      }

      // Pre-warm shaders
      renderer.compile(scene, camera);
    };

    rebuildModel();

    // 7. Mouse/Touch interactions
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      pointerRef.current.isDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pointerRef.current.lastX = clientX;
      pointerRef.current.lastY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!pointerRef.current.isDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - pointerRef.current.lastX;
      const dy = clientY - pointerRef.current.lastY;
      pointerRef.current.targetX += dx * 0.006;
      pointerRef.current.targetY = Math.max(-0.4, Math.min(0.8, pointerRef.current.targetY + dy * 0.005));
      pointerRef.current.lastX = clientX;
      pointerRef.current.lastY = clientY;
    };

    const onPointerUp = () => {
      pointerRef.current.isDown = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 8. Resize handler
    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 9. Lossless 60fps Loop with Exponential Damping
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Exponential damping on pointer rotation
      const dampFactor = 1 - Math.exp(-8 * dt);
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * dampFactor;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * dampFactor;

      // Auto-rotation when not dragging
      if (!pointerRef.current.isDown) {
        pointerRef.current.targetX += 0.25 * speedRef.current * dt;
      }

      // Smoothly update camera orbit
      const radius = 6.2;
      const theta = pointerRef.current.x;
      const phi = Math.PI / 2 - pointerRef.current.y;
      _vec3.set(
        radius * Math.sin(phi) * Math.sin(theta),
        1.2 + radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.position.lerp(_vec3, dampFactor);
      camera.lookAt(_targetLookAt);

      // Apply Exploded View smoothly
      const targetExplode = explodedRef.current;
      for (const part of subParts) {
        const targetPos = part.basePos.clone().addScaledVector(part.explodeDir, targetExplode * 1.5);
        part.mesh.position.lerp(targetPos, dampFactor);

        // Apply wireframe updates
        part.mesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.Material;
            if (mat && 'wireframe' in mat) {
              (mat as any).wireframe = wireframeRef.current;
            }
          }
        });
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeModel, adminUnlocked]);

  // Handle lighting preset changes
  useEffect(() => {
    if (!keyLightRef.current || !sceneRef.current) return;
    if (lightingPreset === 'cyber') {
      keyLightRef.current.color.setHex(0x38bdf8);
      keyLightRef.current.intensity = 3.5;
      sceneRef.current.background = new THREE.Color(0x030712);
    } else if (lightingPreset === 'studio') {
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 2.8;
      sceneRef.current.background = new THREE.Color(0x090d16);
    } else if (lightingPreset === 'gold') {
      keyLightRef.current.color.setHex(0xf59e0b);
      keyLightRef.current.intensity = 3.2;
      sceneRef.current.background = new THREE.Color(0x130d04);
    }
  }, [lightingPreset]);

  return (
    <div className="relative w-full h-[600px] lg:h-[720px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas Mount (Stable Ref Container) */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Minimal Title Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-xl shadow-lg pointer-events-auto">
        <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide">
            {activeModel === 'neural_core' && 'نواة عبقرينو الكمومية (10 أجزاء إجرائية)'}
            {activeModel === 'architecture' && 'المعماري السحابي المجسم (8 أجزاء PBR)'}
            {activeModel === 'vault' && 'خزينة التسليم المشفرة (المحفظة 01153747612)'}
          </h4>
          <p className="text-[10px] text-cyan-300 font-mono">60 FPS • ACES Filmic • Studio PBR</p>
        </div>
      </div>

      {/* Top Right Quick Hint */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
        <span>اسحب بالماوس للتدوير</span>
        <span className="text-slate-500">•</span>
        <span>حرك المنزلق لتفكيك الأجزاء</span>
      </div>

      {/* Collapsible Viewport-First Bottom Control Dock (<= 15% viewport footprint) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-transform duration-300 pointer-events-auto ${
          isHudCollapsed ? 'translate-y-[82%]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Button Header */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsHudCollapsed(!isHudCollapsed)}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-slate-900 border border-b-0 border-slate-700 rounded-t-xl text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors shadow-md"
          >
            <span>{isHudCollapsed ? '▴ إظهار لوحة التحكم ثلاثية الأبعاد' : '▾ إخفاء لوحة التحكم (Cinema Mode)'}</span>
          </button>
        </div>

        {/* Solid Glassmorphic Surface Dock (Solid RGBA surfaces, no backdrop-filter to prevent WebGL stalls) */}
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* 1. Model Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">المجسم الإجرائي:</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveModel('neural_core')}
                  className={`text-xs py-1.5 px-2 rounded-md transition-colors ${
                    activeModel === 'neural_core'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  النواة الذكية
                </button>
                <button
                  onClick={() => setActiveModel('architecture')}
                  className={`text-xs py-1.5 px-2 rounded-md transition-colors ${
                    activeModel === 'architecture'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  المعمارية
                </button>
                <button
                  onClick={() => setActiveModel('vault')}
                  className={`text-xs py-1.5 px-2 rounded-md transition-colors ${
                    activeModel === 'vault'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الخزينة
                </button>
              </div>
            </div>

            {/* 2. Exploded View Slider */}
            <div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 mb-1.5">
                <span>تفكيك الأجزاء (Exploded View):</span>
                <span className="font-mono text-cyan-400">{Math.round(explodedRatio * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedRatio}
                onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 border border-slate-800"
              />
            </div>

            {/* 3. Lighting & Surface Preset */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">إضاءة الاستوديو PBR:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLightingPreset('cyber')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                    lightingPreset === 'cyber'
                      ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Cyber
                </button>
                <button
                  onClick={() => setLightingPreset('studio')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                    lightingPreset === 'studio'
                      ? 'border-slate-400 bg-slate-800 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Studio
                </button>
                <button
                  onClick={() => setLightingPreset('gold')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                    lightingPreset === 'gold'
                      ? 'border-amber-500 bg-amber-950/60 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  Gold
                </button>
              </div>
            </div>

            {/* 4. Toggles: Wireframe & Rotation */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`flex-1 text-xs py-2 px-3 rounded-xl border transition-all ${
                  wireframe
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {wireframe ? 'الهيكل الشبكي: مفعل' : 'الهيكل الشبكي: معطل'}
              </button>
              <button
                onClick={() => setRotationSpeed(rotationSpeed === 0 ? 1 : 0)}
                className={`text-xs py-2 px-3 rounded-xl border transition-all ${
                  rotationSpeed > 0
                    ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
                title="إيقاف / تشغيل الدوران التلقائي"
              >
                {rotationSpeed > 0 ? 'دوران ⟳' : 'توقف ⏸'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
