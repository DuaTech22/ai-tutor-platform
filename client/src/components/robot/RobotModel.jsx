import { useGLTF } from "@react-three/drei";

function RobotModel() {
  const { scene } = useGLTF("/models/scene.gltf");
  return <primitive object={scene} scale={1.2} position={[0, -1, 0]} />;
}

export default RobotModel;

useGLTF.preload("/models/scene.gltf");
