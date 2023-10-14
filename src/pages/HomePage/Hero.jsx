import { useState } from "react";
import styles from "./Hero.module.css";
import Lottie from "lottie-react";
import animation from "../../assets/animations/spotifyAnimation.json";

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
      <Lottie
        className={styles.lottie}
        animationData={animation}
        autoplay
        loop
      />
    </div>
  );
};

export default Hero;
