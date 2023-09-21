import { useCallback } from "react";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import useTopItems from "../../customHooks/useTopItems";
import ListItem from "../../components/ListItem";
import styles from "./YourTopSongs.module.css";

function YourTopSongs() {
  const apiEndpoint = "https://api.spotify.com/v1/me/top/tracks";
  const { items, loading, hasMore } = useTopItems(apiEndpoint);

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
      <div className={styles.firstContainer}>
        <div className={styles.innerContainer}>
          {items.map((item, index) => (
            <ListItem
              key={index}
              name={item.name}
              previewUrl={item.preview_url}
              isTrack={true}
            />
          ))}
          {loading && <p>Loading...</p>}
          {!hasMore && <p>No more items to fetch.</p>}
        </div>
      </div>
    </>
  );
}
export default YourTopSongs;
