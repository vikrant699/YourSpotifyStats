import { NavLink } from "react-router-dom";
import LoginButton from "../../components/LoginButton";
import styles from "./NavigationBar.module.css";

const NavigationBar = () => {
  return (
    <nav className={styles.navBar}>
      <li className={styles.navBarLi}>Top Playlists</li>
      <li className={styles.navBarLi}>
        <NavLink
          to="/topSongs"
          className={({ isActive }) => {
            return;
            /*return the classname you requite for active navlink, good for navigation bars*/
          }}
        >
          Top Songs
        </NavLink>
      </li>
      <li className={styles.navBarLi}>Top Artists</li>
      <li className={styles.navBarLi}>Top Whatever</li>
      <li className={styles.navBarLi}>
        <LoginButton />
      </li>
    </nav>
  );
};

export default NavigationBar;
