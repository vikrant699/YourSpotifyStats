import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import styles from "./ListItem.module.css";
import playAnimation from "../assets/animations/playAnimation.json";
import pauseAnimation from "../assets/animations/pauseAnimation.json";

const ListItem = ({
  name,
  musicLink,
  albumLink,
  artists,
  imgSrc,
  previewUrl,
  isTrack,
}) => {
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
      <div className={styles.infoContainer}>
        <a href={albumLink}>
          <img src={imgSrc} className={styles.albumArt} />
        </a>

        <div>
          <a href={musicLink}>
            <p className={styles.name}>{name}</p>
          </a>
          <div className={styles.artistContainer}>
            {artists.map((artist, index) => (
              <a href={artist.external_urls.spotify} key={index}>
                <p className={styles.artist}>
                  {index < artists.length - 1 ? `${artist.name},` : artist.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
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
