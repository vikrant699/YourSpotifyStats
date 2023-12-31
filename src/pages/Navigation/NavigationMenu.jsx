import { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import LoginButton from "../../components/LoginButton";
import styles from "./NavigationMenu.module.css";
import logo from "../../assets/images/logo.png";

const NavigationMenu = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (navbarOpen) {
      document.body.classList.add(styles.disableScroll);
    } else {
      document.body.classList.remove(styles.disableScroll);
    }

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
            <NavLink
              onClick={handleShowNavbar}
              to="/"
              className={styles.navBarLi}
            >
              <img className={styles.logo} src={logo} />
            </NavLink>
            <NavLink
              onClick={handleShowNavbar}
              to="/topSongs"
              className={({ isActive }) => {
                return isActive ? styles.selectedNavBarLi : styles.navBarLi;
              }}
            >
              Top Songs
            </NavLink>
            <NavLink
              onClick={handleShowNavbar}
              to="/topArtists"
              className={({ isActive }) => {
                return isActive ? styles.selectedNavBarLi : styles.navBarLi;
              }}
            >
              Top Artists
            </NavLink>
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
