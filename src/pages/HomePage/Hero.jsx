import { useState } from "react";
import styles from "./Hero.module.css";
import { Player } from "@lottiefiles/react-lottie-player";
import animation from "../../assets/animations/animation4.json";

const Hero = () => {
  const [showBorder, setShowBorder] = useState(true);

  const handleAnimationEnd = () => {
    setTimeout(() => {
      setShowBorder(false);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerText}>
        <p
          className={`${styles.text} ${styles.typewriter} ${
            !showBorder && styles.noBorder
          }`}
          onAnimationEnd={handleAnimationEnd}
        >
          Your melodies.
        </p>
        <p
          className={`${styles.textMoments} ${
            showBorder ? styles.invisibleText : styles.typewriterMoments
          }`}
        >
          Your moments.
        </p>
      </div>
      <Player className={styles.lottie} src={animation} autoplay loop />
    </div>
  );
};

export default Hero;
