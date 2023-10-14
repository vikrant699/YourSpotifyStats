import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { authenticate } from "../store/store";
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";

function GlobalErrorBoundary({ children }) {
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["refresh_token"]);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const refreshToken = cookies.refresh_token;
  const auth = useSelector((state) => state.auth.auth);

  useEffect(() => {
    const handleGlobalError = async (error) => {
      if (refreshToken) {
        if (error.response && error.response.status === 401) {
          console.log("refreshing token");
          let body = new URLSearchParams({
            grant_type: "refresh_token",
            client_id: clientId,
            refresh_token: refreshToken,
          });
          try {
            const response = await fetch(
              "https://accounts.spotify.com/api/token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: body,
              }
            );

            if (!response.ok) {
              throw new Error("HTTP status " + response.status);
            }

            const data = await response.json();
            setCookie("refresh_token", data.refresh_token, {
              path: "/",
            });
            setCookie("auth_token", data.access_token, {
              path: "/",
              maxAge: 3600,
            });
            dispatch(authenticate(true));
          } catch (err) {
            console.log("Error occurred during fetching access_token: " + err);
          }
        }
      } else {
        console.log("Setting auth to false");
        dispatch(authenticate(false));
        removeCookie("refresh_token");
        removeCookie("auth_token");
      }
    };
    window.addEventListener("error", handleGlobalError);
    return () => {
      window.removeEventListener("error", handleGlobalError);
    };
  }, [clientId, dispatch, refreshToken, setCookie, removeCookie]);

  useEffect(() => {
    if (cookies.auth_token && !auth) {
      dispatch(authenticate(true));
    }
  }, [cookies, dispatch, auth]);

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

  return (
    <>
      <Particles
        styles={{ zIndex: -100, position: "absolute" }}
        options={particleOptions}
        init={particlesInit}
      />
      {children}
    </>
  );
}

export default GlobalErrorBoundary;
