import { NavLink, Link } from "react-router-dom";
import LoginButton from "../../components/LoginButton";
import styles from "./NavigationBar.module.css";
import logo from "../../assets/images/logo.png";

const NavigationBar = () => {
  return (
    <nav className={styles.navBar}>
      <li className={styles.logoListItem}>
        <Link to="/">
          <img className={styles.logo} src={logo} />
        </Link>
      </li>
      <li className={styles.navBarLi}>Top Playlists</li>
      <NavLink
        to="/topSongs"
        className={({ isActive }) => {
          return isActive ? styles.navLinkActive : styles.navBarLi;
        }}
      >
        Top Songs
      </NavLink>
      <li className={styles.navBarLi}>Top Artists</li>
      <li className={styles.navBarLi}>Top Whatever</li>
      <li className={styles.navBarLogin}>
        <LoginButton />
      </li>
    </nav>
  );
};

export default NavigationBar;
