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
    if (!scene) return;

    headRef.current = scene.getObjectByName("head");

    try {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(center.x, center.y, maxDim * 2.2);
      camera.lookAt(center.x, center.y, center.z);
    } catch (error) {
      console.warn("Error setting up robot camera:", error);
    }
  }, [scene, camera]);

  useFrame(({ mouse, clock }, delta) => {
    if (!group.current || !scene) return;

    try {
      const t = clock.elapsedTime;

      const speed = emotion === "celebrate" ? 5 : 1.5;
      const bobAmount = emotion === "celebrate" ? 0.18 : 0.05;
      group.current.position.y = Math.sin(t * speed) * bobAmount;

      const targetRotY = mouse.x * 0.3;
      const targetRotX = -mouse.y * 0.15;
      group.current.rotation.y +=
        (targetRotY - group.current.rotation.y) * 0.05;
      group.current.rotation.x +=
        (targetRotX - group.current.rotation.x) * 0.05;

      setBlinkTimer((prev) => {
        const next = prev + delta;
        if (headRef.current) {
          if (next > 4 && next < 4.15) {
            headRef.current.scale.y = 0.85;
          } else {
            headRef.current.scale.y = 1;
          }
        }
        return next > 4.15 ? 0 : next;
      });
    } catch (error) {
      // Silent fail for animation errors
    }
  });

  if (!scene) {
    return null;
  }

  return (
    <group ref={group}>
      {/* ✅ Scale up to 1.0 for bigger robot */}
      <primitive object={scene} scale={1.0} />
    </group>
  );
}

export default RobotModel;

useGLTF.preload("/models/scene.gltf");
