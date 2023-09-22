import { useCallback } from "react";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import useTopItems from "../../customHooks/useTopItems";
import ListItem from "../../components/ListItem";
import styles from "./YourTopSongs.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function YourTopSongs() {
  const apiEndpoint = "https://api.spotify.com/v1/me/top/tracks";
  const { items, loading, hasMore } = useTopItems(apiEndpoint);
  console.log(items);

  const particlesInit = useCallback(async (engine) => {
    await loadStarsPreset(engine);
  }, []);

  const particleOptions = {
    preset: "stars",
    particles: {
      number: {
        value: window.innerWidth / 5,
      },
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Populatity of Top 10 Tracks",
      },
    },
  };

  const chartLabels = items.slice(0, 10).map((obj) => obj.name);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Track's Popularity",
        data: items.slice(0, 10).map((obj) => obj.popularity),
        backgroundColor: "#1db954",
      },
    ],
  };

  return (
    <>
      <Particles
        className={styles.particles}
        options={particleOptions}
        init={particlesInit}
      />
      <div className={styles.firstContainer}>
        <div
          style={{
            width: "40vw",
            backgroundColor: "black",
            opacity: 0.9,
            padding: 20,
            borderRadius: 20,
          }}
        >
          <Bar options={chartOptions} data={chartData} />
        </div>
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
