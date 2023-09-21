import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import styles from "./ListItem.module.css";
import playAnimation from "../assets/animations/playAnimation.json";
import pauseAnimation from "../assets/animations/pauseAnimation.json";

const ListItem = ({ name, previewUrl, isTrack }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlayPauseClick = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    const audioStatus = audioRef.current;
    const handlePlaying = () => {
      if (audioStatus.duration > 5) {
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }
    };

    if (audioStatus) {
      audioStatus.addEventListener("canplaythrough", handlePlaying);
    }

    return () => {
      if (audioStatus) {
        audioStatus.removeEventListener("canplaythrough", handlePlaying);
      }
    };
  }, []);

  return (
    <div className={styles.listItemContainer}>
      <p className={styles.name}>{name}</p>
      {isTrack ? (
        <div className={styles.lottieContainer}>
          {isPlaying && isLoaded ? (
            <Lottie
              onClick={handlePlayPauseClick}
              className={styles.lottie}
              animationData={playAnimation}
              autoplay={isPlaying && isLoaded ? true : false}
              loop={false}
            />
          ) : (
            <Lottie
              onClick={handlePlayPauseClick}
              className={styles.lottie}
              animationData={pauseAnimation}
              autoplay={isPlaying && isLoaded ? false : true}
              loop={false}
            />
          )}
          <audio ref={audioRef} src={previewUrl} onEnded={handleAudioEnded} />
        </div>
      ) : (
        <button>Test Button</button>
      )}
    </div>
  );
};

export default ListItem;
