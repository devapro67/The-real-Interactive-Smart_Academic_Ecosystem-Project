import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[-4, 2, -5]}>
          <MeshDistortMaterial
            color="#3b82f6"
            speed={2}
            distort={0.4}
            radius={1}
          />
        </Sphere>
      </Float>
      
      <Float speed={3} rotationIntensity={2} floatIntensity={3}>
        <mesh position={[4, -2, -6]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh position={[0, -4, -8]}>
          <coneGeometry args={[1, 2, 32]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
      </Float>
    </>
  );
};

const ModelPen = ({ position, rotation }: any) => {
  const ref = useRef<THREE.Group>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.mouse;
    const targetX = x * 10;
    const targetY = y * 10;
    
    const dx = ref.current.position.x - targetX;
    const dy = ref.current.position.y - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const pushStrength = 3;
    const repelDist = 6;

    if (dist < repelDist) {
      const angle = Math.atan2(dy, dx);
      const force = (repelDist - dist) / repelDist;
      ref.current.position.x += Math.cos(angle) * force * pushStrength * 0.15;
      ref.current.position.y += Math.sin(angle) * force * pushStrength * 0.15;
    }

    ref.current.position.x += (initialPos.x - ref.current.position.x) * 0.02;
    ref.current.position.y += (initialPos.y - ref.current.position.y) * 0.02;
  });

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1} rotation={rotation}>
      <group ref={ref} position={[0, 0, position[2]]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 3.5, 32]} />
          <meshPhysicalMaterial color="#334155" metalness={0.9} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.8, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.01, 0.4, 32]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={1} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
};

const HighEndCompass = ({ position, rotation }: any) => {
  const ref = useRef<THREE.Group>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.mouse;
    const targetX = x * 10;
    const targetY = y * 10;
    const dx = ref.current.position.x - targetX;
    const dy = ref.current.position.y - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 6) {
      const angle = Math.atan2(dy, dx);
      ref.current.position.x += Math.cos(angle) * 0.2;
      ref.current.position.y += Math.sin(angle) * 0.2;
    }
    ref.current.position.x += (initialPos.x - ref.current.position.x) * 0.02;
    ref.current.position.y += (initialPos.y - ref.current.position.y) * 0.02;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1} rotation={rotation}>
      <group ref={ref} scale={0.7} position={[0, 0, position[2]]}>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 4.5, 32]} />
          <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial color="#fbbf24" metalness={1} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
};

const HighEndBook = ({ position, rotation, color = "#334155" }: any) => {
  const ref = useRef<THREE.Group>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.mouse;
    const targetX = x * 12;
    const targetY = y * 12;
    const dx = ref.current.position.x - targetX;
    const dy = ref.current.position.y - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 7) {
      const angle = Math.atan2(dy, dx);
      ref.current.position.x += Math.cos(angle) * 0.25;
      ref.current.position.y += Math.sin(angle) * 0.25;
    }
    ref.current.position.x += (initialPos.x - ref.current.position.x) * 0.025;
    ref.current.position.y += (initialPos.y - ref.current.position.y) * 0.025;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} rotation={rotation}>
      <group ref={ref} scale={0.8} position={[0, 0, position[2]]}>
        <mesh>
          <boxGeometry args={[3, 4, 0.4]} />
          <meshPhysicalMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[2.8, 3.8, 0.35]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0, 0.6]} rotation={[-0.2, 0.2, 0]}>
          <planeGeometry args={[2, 3]} />
          <meshStandardMaterial color="#818cf8" transparent opacity={0.2} emissive="#818cf8" emissiveIntensity={1} />
        </mesh>
      </group>
    </Float>
  );
};

const HighEndCalculator = ({ position, rotation }: any) => {
  const ref = useRef<THREE.Group>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.mouse;
    const targetX = x * 10;
    const targetY = y * 10;
    const dx = ref.current.position.x - targetX;
    const dy = ref.current.position.y - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 6) {
      const angle = Math.atan2(dy, dx);
      ref.current.position.x += Math.cos(angle) * 0.2;
      ref.current.position.y += Math.sin(angle) * 0.2;
    }
    ref.current.position.x += (initialPos.x - ref.current.position.x) * 0.02;
    ref.current.position.y += (initialPos.y - ref.current.position.y) * 0.02;
  });

  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={0.8} rotation={rotation}>
      <group ref={ref} scale={0.7} position={[0, 0, position[2]]}>
        <mesh>
          <boxGeometry args={[2.5, 4, 0.4]} />
          <meshPhysicalMaterial color="#0f172a" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.2, 0.21]}>
          <planeGeometry args={[2.1, 1]} />
          <meshPhysicalMaterial color="#1e1b4b" emissive="#4338ca" emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
        <group position={[0, -0.8, 0.21]}>
          {[...Array(12)].map((_, i) => (
            <mesh key={i} position={[(i % 3 - 1) * 0.6, (Math.floor(i / 3) - 1.5) * -0.6, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.1]} />
              <meshPhysicalMaterial color={i === 9 ? "#c026d3" : "#334155"} roughness={0.2} clearcoat={0.5} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};

export const BackgroundUniverse = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={3} />
        
        <HighEndCompass position={[-8, 4, -5]} rotation={[0.4, 0.2, 0]} />
        <HighEndCompass position={[9, -3, -2]} rotation={[-0.2, -0.4, 0.5]} />
        
        <HighEndBook position={[-10, -5, -4]} rotation={[0.5, 0.5, 0.2]} color="#4338ca" />
        <HighEndBook position={[12, 6, -8]} rotation={[-0.4, -0.2, -0.3]} color="#701a75" />
        <HighEndBook position={[0, 8, -12]} rotation={[0.2, 0.8, -0.1]} color="#1e293b" />
        
        <HighEndCalculator position={[7, 3, -4]} rotation={[0.2, -0.3, -0.2]} />
        <HighEndCalculator position={[-6, -8, -6]} rotation={[-0.5, 0.4, 0.1]} />
        
        <ModelPen position={[-4, 6, -2]} rotation={[Math.PI / 4, 0, Math.PI / 6]} />
        <ModelPen position={[6, -6, -1]} rotation={[-Math.PI / 3, 0.5, 0]} />
        <ModelPen position={[14, 0, -5]} rotation={[0.2, -0.8, 0.4]} />
        
        <Environment preset="city" />
        <FloatingShapes />
      </Canvas>
    </div>
  );
};
