import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
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
  /* eslint-disable */
  const [cookies, setCookie, removeCookie] = useCookies(["refresh_token"]);
  const auth = useSelector((state) => state.auth.auth);

  const apiEndpoint = "https://api.spotify.com/v1/me/top/tracks";
  /* eslint-disable */
  const { items, loading, hasMore } = useTopItems(apiEndpoint);
  console.log(items);

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

  useEffect(() => {
    console.log(auth);
    if (!cookies.auth_token && !auth) {
      throw new Error("You have not logged in yet :(");
    }
  }, [auth]);

  return (
    <>
      <div className={styles.firstContainer}>
        <p className={styles.pageTitle}>Your Top Tracks (past 6 months)</p>
        <div className={styles.chartContainer}>
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
