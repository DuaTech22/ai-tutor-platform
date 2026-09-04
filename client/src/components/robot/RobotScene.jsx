import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import RobotModel from "./RobotModel.jsx";

function RobotScene({ emotion = "idle" }) {
  return (
    // ✅ Made bigger
    <div className="w-[320px] sm:w-[380px] md:w-[420px] h-[380px] sm:h-[420px] md:h-[460px]">
      <Canvas camera={{ position: [2, 2, 5], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 0, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <RobotModel emotion={emotion} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

export default RobotScene;
