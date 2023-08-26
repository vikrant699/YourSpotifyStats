import { useEffect } from "react";
import {
  generateRandomString,
  generateCodeChallenge,
} from "../helpers/SpotifyLogin";
import styles from "./LoginButton.module.css";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../store/store";

const LoginButton = () => {
  const dispatch = useDispatch();
  /* eslint-disable */
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const authToken = useSelector((state) => state.auth.auth);

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_DOMAIN;

  const login = async () => {
    let codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    let state = generateRandomString(16);
    let scope = [
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
    ];

    localStorage.setItem("code_verifier", codeVerifier);

    let args = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope.join(),
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location = "https://accounts.spotify.com/authorize?" + args;
  };

  useEffect(() => {
    const getAccessToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get("code");
      let codeVerifier = localStorage.getItem("code_verifier");

      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
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
        console.log(data);
        setCookie("refresh_token", data.refresh_token, {
          path: "/",
          sameSite: "strict",
        });
        dispatch(authenticate(data.access_token));
      } catch (err) {
        console.log("Error occurred during fetching access_token: " + err);
      }
    };

    if (localStorage.getItem("code_verifier") !== null) {
      getAccessToken();
      localStorage.removeItem("code_verifier");
    }
  }, [clientId, redirectUri, setCookie, dispatch]);

  const logout = () => {
    dispatch(authenticate(null));
    removeCookie("refresh_token");
  };

  return (
    <>
      {!authToken && (
        <button onClick={login} className={styles.loginBtn}>
          Login
        </button>
      )}
      {authToken && (
        <button onClick={logout} className={styles.loginBtn}>
          Logout
        </button>
      )}
    </>
  );
};

export default LoginButton;
