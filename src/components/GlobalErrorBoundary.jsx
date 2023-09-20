import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { authenticate } from "../store/store";

function GlobalErrorBoundary({ children }) {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["refresh_token"]);
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const refreshToken = cookies.refresh_token;

  const handleGlobalError = useCallback(
    async (error) => {
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
        } else {
          dispatch(authenticate(false));
        }
      }
    },
    [refreshToken, clientId, setCookie, dispatch]
  );

  useEffect(() => {
    window.addEventListener("error", handleGlobalError);
    return () => {
      window.removeEventListener("error", handleGlobalError);
    };
  }, [handleGlobalError]);

  useEffect(() => {
    handleGlobalError();
    /* eslint-disable */
  }, []);

  return <>{children}</>;
}

export default GlobalErrorBoundary;
