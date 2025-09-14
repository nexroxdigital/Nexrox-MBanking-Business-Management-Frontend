import Featured from "../../components/Featured/Featured";
import Hero from "../../components/Hero/Hero";
import MysteryArtifacts from "../../components/MysteryArtifacts/MysteryArtifacts";
import Quiz from "../../components/Quiz/Quiz";
import TimeCapsule from "../../components/TimeCapsule/TimeCapsule";

const Home = () => {
  return (
    <>
      <title>Home | ArtifactVault</title>
      <Hero />
      <Featured />
      <TimeCapsule />
      <MysteryArtifacts />
      <Quiz />
    </>
  );
};

export default Home;
