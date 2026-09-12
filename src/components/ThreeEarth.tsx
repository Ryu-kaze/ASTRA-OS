import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Satellite, DebrisObject } from '../types';
import { Maximize2, Minimize2, RotateCcw, Play, Pause, Layers } from 'lucide-react';

interface ThreeEarthProps {
  satellites?: Satellite[];
  debris?: DebrisObject[];
  onSelectSatellite?: (sat: Satellite) => void;
  height?: string;
  showOrbits?: boolean;
}

export const ThreeEarth: React.FC<ThreeEarthProps> = ({
  satellites = [],
  debris = [],
  onSelectSatellite,
  height = '500px',
  showOrbits = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showDebris, setShowDebris] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const satGroupRef = useRef<THREE.Group | null>(null);
  const debrisGroupRef = useRef<THREE.Group | null>(null);
  const isRotatingRef = useRef<boolean>(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Stars Particle Field
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 200;
      starPositions[i + 1] = (Math.random() - 0.5) * 200;
      starPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 3. Earth Texture Procedural Creation
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Ocean background
      ctx.fillStyle = '#0a192f';
      ctx.fillRect(0, 0, 1024, 512);

      // Continent Landmasses
      ctx.fillStyle = '#1e3a8a';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = Math.random() * 40 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tech Grid overlay
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y < 512; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    const earthGeometry = new THREE.SphereGeometry(3, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 25,
      specular: new THREE.Color(0x00f2ff),
      emissive: new THREE.Color(0x020817),
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMeshRef.current = earthMesh;
    scene.add(earthMesh);

    // 4. Atmospheric Glow
    const atmosphereGeometry = new THREE.SphereGeometry(3.2, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f2ff, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    // 6. Satellites Group & Orbits
    const satGroup = new THREE.Group();
    satGroupRef.current = satGroup;
    earthMesh.add(satGroup);

    const displaySats = satellites.length > 0 ? satellites.slice(0, 60) : [];
    displaySats.forEach((sat, i) => {
      const radius = 3 + (sat.altitude / 36000) * 2.5 + 0.3;
      const phi = (90 - sat.latitude) * (Math.PI / 180);
      const theta = (sat.longitude + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      // Satellite Mesh
      const isCritical = sat.status === 'Critical' || sat.status === 'Warning';
      const color = isCritical ? 0xf43f5e : 0x00f2ff;

      const satGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const satMat = new THREE.MeshBasicMaterial({ color });
      const satMesh = new THREE.Mesh(satGeom, satMat);
      satMesh.position.set(x, y, z);
      satMesh.userData = { sat };
      satGroup.add(satMesh);

      // Orbit Line Path
      if (showOrbits && i % 3 === 0) {
        const curvePoints = [];
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          const ox = radius * Math.cos(angle);
          const oz = radius * Math.sin(angle);
          curvePoints.push(new THREE.Vector3(ox, Math.sin(angle * 2) * 0.5, oz));
        }
        const orbitGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const orbitMat = new THREE.LineBasicMaterial({
          color: isCritical ? 0xf43f5e : 0x7000ff,
          transparent: true,
          opacity: 0.3,
        });
        const orbitLine = new THREE.Line(orbitGeom, orbitMat);
        satGroup.add(orbitLine);
      }
    });

    // 7. Debris Cloud Group
    const debrisGroup = new THREE.Group();
    debrisGroupRef.current = debrisGroup;
    earthMesh.add(debrisGroup);

    const displayDebris = debris.length > 0 ? debris.slice(0, 150) : [];
    displayDebris.forEach((deb) => {
      const radius = 3 + (deb.altitude / 2000) * 0.8 + 0.2;
      const phi = (90 - deb.latitude) * (Math.PI / 180);
      const theta = (deb.longitude + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const debGeom = new THREE.SphereGeometry(0.04, 8, 8);
      const debMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const debMesh = new THREE.Mesh(debGeom, debMat);
      debMesh.position.set(x, y, z);
      debrisGroup.add(debMesh);
    });

    // 8. Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (earthMeshRef.current && isRotatingRef.current) {
        earthMeshRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth && newHeight) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [satellites, debris, showOrbits]);

  // Toggle Debris Visibility
  useEffect(() => {
    if (debrisGroupRef.current) {
      debrisGroupRef.current.visible = showDebris;
    }
  }, [showDebris]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl overflow-hidden transition-all shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Three Canvas Mounted Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Control Overlay Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-1.5 rounded-xl text-xs">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          title={isRotating ? 'Pause Orbit Rotation' : 'Rotate Earth'}
        >
          {isRotating ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={() => setShowDebris(!showDebris)}
          className={`p-1.5 rounded-lg transition ${
            showDebris ? 'bg-amber-950 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
          }`}
          title="Toggle Debris Cloud Layer"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Globe'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-purple-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      {/* Earth Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 px-3 py-2 rounded-xl text-[10px] font-mono space-y-1">
        <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">ORBITAL LAYERS</div>
        <div className="flex items-center space-x-2 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2ff]" />
          <span>Active Satellites (1,248)</span>
        </div>
        <div className="flex items-center space-x-2 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Debris Fragments (500)</span>
        </div>
        <div className="flex items-center space-x-2 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Conjunction Threat Alerts</span>
        </div>
      </div>
    </div>
  );
};
