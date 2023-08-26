import { useEffect, useRef, useState } from "react";
import {
  generateRandomString,
  generateCodeChallenge,
} from "../helpers/SpotifyLogin";
import styles from "./LoginButton.module.css";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../store/store";
import emptyAvatar from "../assets/images/emptyAvatar.webp";

const LoginButton = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const ref = useRef();
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
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (authToken) {
      getUserInfo();
    }
  }, [authToken]);

  useEffect(() => {
    const handler = (event) => {
      if (isClicked && !ref?.current?.contains(event.target)) {
        setIsClicked(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [isClicked]);

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

  const handleClick = () => {
    setIsClicked((state) => !state);
  };

  return (
    <>
      {!authToken && (
        <button onClick={login} className={styles.loginBtn}>
          Login
        </button>
      )}
      {authToken && (
        <div className={styles.mainContainer} onClick={handleClick}>
          <div
            ref={ref}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            className={`${styles.profileContainer} ${
              (isHovered || isClicked) && styles.profileContainerSelected
            }`}
          >
            <img
              src={
                userInfo?.images[0]?.url !==
                "https://scontent-ord5-1.xx.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c15.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=12b3be&_nc_ohc=KhSDvtF-tNsAX-JVg21&_nc_ht=scontent-ord5-1.xx&edm=AP4hL3IEAAAA&oh=00_AfCRwK8h7ZyzrUjHEzyrXtd9GRCBVlKQW_mO1AIRJ__img&oe=6511C099"
                  ? userInfo?.images[0]?.url
                  : emptyAvatar
              }
              className={styles.avatar}
            />
            <p className={styles.name}>{userInfo?.display_name}</p>
          </div>
          <ul
            className={`${styles.content} ${
              (isHovered || isClicked) && styles.contentOpen
            }`}
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
