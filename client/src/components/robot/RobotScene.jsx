import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import RobotModel from "./RobotModel.jsx";

function RobotScene({ emotion }) {
  return (
    <div className="w-full max-w-sm h-[320px] mx-auto">
      <Canvas camera={{ fov: 40 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <RobotModel emotion={emotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default RobotScene;
