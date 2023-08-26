import { useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { authenticate } from "./store/store";
import { useDispatch } from "react-redux";
import NavigationBar from "./pages/Navigation/NavigationBar";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import Hero from "./pages/HomePage/Hero";
import styles from "./App.module.css";
import NavigationMenu from "./pages/Navigation/NavigationMenu";

function App() {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["refresh_token"]);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const refreshToken = cookies.refresh_token;

  const getAccessToken = useCallback(async () => {
    if (refreshToken) {
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
        dispatch(authenticate(data.access_token));
      } catch (err) {
        console.log("Error occurred during fetching access_token: " + err);
      }
    }
  }, [refreshToken, setCookie, dispatch, clientId]);

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

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
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
      {window.innerWidth > 768 ? <NavigationBar /> : <NavigationMenu />}
      <Hero />
    </>
  );
}

export default App;
