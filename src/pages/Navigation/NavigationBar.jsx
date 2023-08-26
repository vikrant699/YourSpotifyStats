import LoginButton from "../../components/LoginButton";
import styles from "./NavigationBar.module.css";

const NavigationBar = () => {
  return (
    <nav className={styles.navBar}>
      <li>Top Playlists</li>
      <li>Top Songs</li>
      <li>Top Artists</li>
      <li>Top Whatever</li>
      <li>
        <LoginButton />
      </li>
    </nav>
  );
};

export default NavigationBar;
