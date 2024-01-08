import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";
import HomePage from "./pages/HomePage/HomePage";
import YourTopStuff from "./pages/YourTopStuff/YourTopStuff";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "topSongs",
        element: (
          <YourTopStuff
            key="tracks"
            title="Your Top Tracks (past 6 months)"
            apiEndpoint="https://api.spotify.com/v1/me/top/tracks"
            chartLegend="Populatity of Top 10 Tracks"
            datasetLabel="Track's Popularity"
            showChart={true}
            isTrack={true}
          />
        ),
      },
      {
        path: "topArtists",
        element: (
          <YourTopStuff
            key="artists"
            title="Your Top Artists (past 6 months)"
            apiEndpoint="https://api.spotify.com/v1/me/top/artists"
            chartLegend="Populatity of Top 10 Artists"
            datasetLabel="Artist's Popularity"
            showChart={true}
            isTrack={false}
          />
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
