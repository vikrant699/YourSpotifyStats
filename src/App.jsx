import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { authenticate } from "./store/store";
import Navigation from "./pages/Navigation/Navigation";
import HomePage from "./pages/HomePage/HomePage";
import YourTopSongs from "./pages/YourTopSongs/YourTopSongs";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { getUserTopItems } from "./loaders/loaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "topSongs",
        element: <YourTopSongs />,
        loader: getUserTopItems,
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["refresh_token"]);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const refreshToken = cookies.refresh_token;
  const authToken = cookies.auth_token;

  const getAccessToken = useCallback(async () => {
    if (refreshToken && !authToken) {
      let body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: refreshToken,
      });

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        });

        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }

        const data = await response.json();
        setCookie("refresh_token", data.refresh_token, {
          path: "/",
          sameSite: true,
        });
        setCookie("auth_token", data.access_token, {
          path: "/",
          sameSite: true,
          maxAge: 3600,
        });
        dispatch(authenticate(true));
      } catch (err) {
        console.log("Error occurred during fetching access_token: " + err);
      }
    } else if (!refreshToken && !authToken) {
      dispatch(authenticate(false));
    } else if (refreshToken && authToken) {
      dispatch(authenticate(true));
    }
  }, [refreshToken, authToken, setCookie, dispatch, clientId]);

  useEffect(() => {
    const refreshInterval = setInterval(getAccessToken, 3300000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [getAccessToken]);

  useEffect(() => {
    getAccessToken();
    /* eslint-disable */
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
