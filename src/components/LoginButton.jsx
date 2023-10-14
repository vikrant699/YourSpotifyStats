import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginHelper } from "../helpers/SpotifyLogin";
import styles from "./LoginButton.module.css";
import { authenticate } from "../store/store";
import emptyAvatar from "../assets/images/emptyAvatar.webp";

const LoginButton = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  /* eslint-disable */
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);
  const authToken = cookies.auth_token;

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_DOMAIN;

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
          pathname: "/",
        });
        setCookie("auth_token", data.access_token, {
          pathname: "/",
          maxAge: 3600,
        });
        dispatch(authenticate(true));
      } catch (err) {
        console.log(err);
      }
    };

    if (localStorage.getItem("code_verifier") !== null) {
      getAccessToken();
      localStorage.removeItem("code_verifier");
    }
  }, [clientId, redirectUri, setCookie, dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!userInfo) {
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
    dispatch(authenticate(false));
    removeCookie("refresh_token");
    removeCookie("auth_token");
    navigate("/");
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
        <button onClick={loginHelper} className={styles.loginBtn}>
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
                userInfo?.images[0]?.url.includes("scdn.co")
                  ? userInfo?.images[0]?.url
                  : emptyAvatar
              }
              className={styles.avatar}
            />
            <p className={styles.name}>
              {userInfo?.display_name ? userInfo?.display_name : "NoName"}
            </p>
          </div>
          <div>
            <ul
              className={`${styles.content} ${
                (isHovered || isClicked) && styles.contentOpen
              }`}
              onMouseEnter={handleHover}
              onMouseLeave={handleMouseLeave}
            >
              <li className={styles.spotifyProfile}>
                <p>
                  <a
                    className={styles.links}
                    target="_blank"
                    href={userInfo?.external_urls?.spotify}
                  >
                    My Spotify Profile
                  </a>
                </p>
              </li>
              <li onClick={logout} className={styles.logout}>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;
