import { useState } from "react";
import styles from "./Hero.module.css";

const Hero = () => {
  const [showBorder, setShowBorder] = useState(true);

  const handleAnimationEnd = () => {
    setTimeout(() => {
      setShowBorder(false);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <p
        className={`${styles.text} ${styles.typewriter} ${
          !showBorder && styles.noBorder
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        Your melodies.
      </p>
      <p
        className={`${styles.text} ${
          showBorder ? styles.invisibleText : styles.typewriter
        }`}
      >
        Your moments.
      </p>
    </div>
  );
};

export default Hero;
