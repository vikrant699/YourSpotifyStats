import { useCallback } from "react";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import useTopItems from "../../customHooks/useTopItems";
import ListItem from "../../components/ListItem";
import styles from "./YourTopSongs.module.css";

function YourTopSongs() {
  const apiEndpoint = "https://api.spotify.com/v1/me/top/tracks";
  const { items, loading, hasMore } = useTopItems(apiEndpoint);
  console.log(items);

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
              albumLink={item.album.external_urls.spotify}
              musicLink={item.external_urls.spotify}
              imgSrc={item.album.images[1].url}
              key={index}
              name={item.name}
              artists={item.artists}
              previewUrl={item.preview_url}
              isTrack={true}
            />
          ))}
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </>
  );
}
export default YourTopSongs;
