import { useCallback } from "react";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Hero from "./Hero";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadStarsPreset(engine);
  }, []);

  const options = {
    preset: "stars",
    particles: {
      number: {
        value: window.innerWidth / 5,
      },
    },
  };

  return (
    <>
      <Particles
        className={styles.particles}
        options={options}
        init={particlesInit}
      />
      <Hero />
    </>
  );
};

export default HomePage;
