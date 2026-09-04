import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function RobotModel({ emotion = "idle" }) {
  const group = useRef();
  const headRef = useRef();
  const { scene } = useGLTF("/models/scene.gltf");
  const [blinkTimer, setBlinkTimer] = useState(0);
  const { camera } = useThree();

  useEffect(() => {
    if (scene) {
      headRef.current = scene.getObjectByName("head");
    }

    if (scene && camera) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(center.x, center.y, maxDim * 2.2);
      camera.lookAt(center.x, center.y, center.z);
    }
  }, [scene, camera]);

  useFrame(({ mouse, clock }, delta) => {
    if (!group.current) return;

    const t = clock.elapsedTime;
    const speed = emotion === "celebrate" ? 5 : 1.5;
    const bobAmount = emotion === "celebrate" ? 0.18 : 0.05;

    group.current.position.y = Math.sin(t * speed) * bobAmount;

    const targetRotY = mouse.x * 0.3;
    const targetRotX = -mouse.y * 0.15;
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.05;

    // Blink animation
    if (headRef.current) {
      setBlinkTimer((prev) => {
        const next = prev + delta;
        if (next > 4 && next < 4.15) {
          headRef.current.scale.y = 0.85;
        } else {
          headRef.current.scale.y = 1;
        }
        return next > 4.15 ? 0 : next;
      });
    }
  });

  if (!scene) {
    return null;
  }

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.85} />
    </group>
  );
}

export default RobotModel;

// Preload the model
useGLTF.preload("/models/scene.gltf");
