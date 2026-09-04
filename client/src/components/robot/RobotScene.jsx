import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react"; // ✅ Correct import
import RobotModel from "./RobotModel.jsx";

function RobotScene({ emotion = "idle" }) {
  return (
    <div className="w-[280px] sm:w-[320px] md:w-[380px] h-[320px] sm:h-[380px] md:h-[420px]">
      <Canvas camera={{ position: [2, 2, 5], fov: 40 }}>
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
