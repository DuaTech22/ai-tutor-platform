import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import RobotModel from "./RobotModel.jsx";

function RobotScene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 1.3, 7], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <RobotModel />
        </Suspense>
        <OrbitControls enableZoom={true} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  );
}

export default RobotScene;
