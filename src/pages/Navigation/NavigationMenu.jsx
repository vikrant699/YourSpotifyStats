import { useState, useRef, useEffect } from "react";
import LoginButton from "../../components/LoginButton";
import styles from "./NavigationMenu.module.css";
import { RxHamburgerMenu } from "react-icons/rx";

const NavigationMenu = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (navbarOpen && !ref?.current?.contains(event.target)) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [navbarOpen]);

  const handleShowNavbar = () => {
    setNavbarOpen((showNavbar) => !showNavbar);
  };

  return (
    <nav ref={ref} className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.menuIcon} onClick={handleShowNavbar}>
          <RxHamburgerMenu size={35} style={{ marginTop: 13 }} />
        </div>
        <div
          className={`${styles.navElements} ${
            navbarOpen && styles.navElementsActive
          }`}
        >
          <ul>
            <li>Top Playlists</li>
            <li>Top Songs</li>
            <li>Top Artists</li>
            <li>Top Whatever</li>
          </ul>
        </div>
        <div className="logo">
          <LoginButton />
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
