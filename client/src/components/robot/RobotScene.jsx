import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Robot from "./robot/Robot.jsx";

function RobotScene({ emotion }) {
  return (
    <div className="w-[200px] sm:w-[240px] md:w-[280px] h-[200px] sm:h-[240px] md:h-[280px]">
      <Canvas camera={{ position: [2, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 0, 5]} intensity={0.5} />
        <Robot emotion={emotion} />
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
