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
import styles from "./YourTopStuff.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YourTopStuff = ({
  apiEndpoint,
  chartLegend,
  datasetLabel,
  showChart,
  isTrack,
  title,
}) => {
  /* eslint-disable */
  const [cookies, setCookie, removeCookie] = useCookies(["refresh_token"]);
  const auth = useSelector((state) => state.auth.auth);
  const { items, loading, hasMore, followedArtists } = useTopItems(
    apiEndpoint,
    isTrack
  );

  const chartOptions = showChart
    ? {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: chartLegend,
          },
        },
      }
    : {};

  const chartLabels = showChart
    ? items.slice(0, 10).map((obj) => obj.name)
    : [];

  const chartData = showChart
    ? {
        labels: chartLabels,
        datasets: [
          {
            label: datasetLabel,
            data: items.slice(0, 10).map((obj) => obj.popularity),
            backgroundColor: "#1db954",
          },
        ],
      }
    : {};

  useEffect(() => {
    if (!cookies.auth_token && !auth) {
      throw new Error("You have not logged in yet :(");
    }
  }, [auth]);

  return (
    <>
      <div className={styles.firstContainer}>
        <p className={styles.pageTitle}>{title}</p>
        {showChart && (
          <div className={styles.chartContainer}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        )}
        <div className={styles.innerContainer}>
          {items.map((item, index) => (
            <ListItem
              albumLink={
                isTrack
                  ? item.album.external_urls.spotify
                  : item.external_urls.spotify
              }
              musicLink={item.external_urls.spotify}
              imgSrc={isTrack ? item.album.images[1].url : item.images[1].url}
              key={index}
              name={item.name}
              artists={isTrack ? item.artists : ""}
              previewUrl={item.preview_url}
              isTrack={isTrack}
              artistID={isTrack ? "" : item.id}
              authToken={cookies.auth_token ? cookies.auth_token : ""}
              followedArtists={isTrack ? [] : followedArtists}
            />
          ))}
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </>
  );
};
export default YourTopStuff;
