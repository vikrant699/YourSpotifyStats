import { useSelector } from "react-redux";
import Lottie from "lottie-react";
import NavigationBar from "../Navigation/NavigationBar";
import NavigationMenu from "../Navigation/NavigationMenu";
import styles from "./ErrorPage.module.css";
import sadAnimation from "../../assets/animations/sadEmojiAnimation.json";
import oopsAnimation from "../../assets/animations/oopsEmojiAnimation.json";

const ErrorPage = () => {
  const auth = useSelector((state) => state.auth.auth);
  const text = auth ? "THIS IS AN ERROR PAGE BOIS" : "YOU FORGOT TO LOGIN";
  const animation = auth ? oopsAnimation : sadAnimation;

  return (
    <>
      {window.innerWidth > 768 ? <NavigationBar /> : <NavigationMenu />}
      <div className={styles.loginPageContainer}>
        <h1>{text}</h1>
        <div className={styles.lottieContainer}>
          <Lottie animationData={animation} autoplay loop />
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
