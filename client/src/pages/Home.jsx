import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import RobotScene from "../components/robot/RobotScene.jsx";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="bg-slate-900 py-10">
        <RobotScene />
      </div>
    </div>
  );
}

export default Home;
