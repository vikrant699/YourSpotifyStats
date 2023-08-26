import { useEffect, useState } from "react";
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
  const [userInfo, setUserInfo] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
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
        setCookie("refresh_token", data.refresh_token, {
          path: "/",
          sameSite: "strict",
        });
        dispatch(authenticate(data.access_token));
      } catch (err) {
        console.log(err);
      }
    };

    if (localStorage.getItem("code_verifier") !== null && !authToken) {
      getAccessToken();
      localStorage.removeItem("code_verifier");
    }
  }, [clientId, redirectUri, setCookie, dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (authToken) {
      getUserInfo();
    }
  }, [authToken]);

  const logout = () => {
    dispatch(authenticate(null));
    removeCookie("refresh_token");
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {!authToken && (
        <button onClick={login} className={styles.loginBtn}>
          {redirectUri}
        </button>
      )}
      {authToken && (
        <div className={styles.mainContainer}>
          <div
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            className={`${styles.profileContainer} ${
              isHovered && styles.profileContainerSelected
            }`}
          >
            <img src={userInfo?.images[0]?.url} className={styles.avatar} />
            <p className={styles.name}>{userInfo?.display_name}</p>
          </div>
          <ul
            className={styles.content}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
          >
            <li className={styles.spotifyProfile}>
              <p>My Spotify Profile</p>
            </li>
            <li onClick={logout} className={styles.logout}>
              <p>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default LoginButton;
