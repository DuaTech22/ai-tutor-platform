import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function RobotModel({ emotion = "idle" }) {
  const group = useRef();
  const { scene } = useGLTF("/models/scene.gltf");

  useFrame(({ mouse, clock }) => {
    if (!group.current) return;

    const speed = emotion === "celebrate" ? 4 : 1.5;
    const bobAmount = emotion === "celebrate" ? 0.15 : 0.05;
    const bob = Math.sin(clock.elapsedTime * speed) * bobAmount;
    group.current.position.y = -1 + bob;

    const targetRotY = mouse.x * 0.3;
    const targetRotX = -mouse.y * 0.15;
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.9} />
    </group>
  );
}

export default RobotModel;
useGLTF.preload("/models/scene.gltf");
