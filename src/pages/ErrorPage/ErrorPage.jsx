import NavigationBar from "../Navigation/NavigationBar";
import NavigationMenu from "../Navigation/NavigationMenu";
import { useSelector } from "react-redux";

const ErrorPage = () => {
  const auth = useSelector((state) => state.auth.auth);

  return (
    <>
      {window.innerWidth > 768 ? <NavigationBar /> : <NavigationMenu />}
      {auth ? (
        <h1>THIS IS AN ERROR PAGE BOIS</h1>
      ) : (
        <h1>PLEASE LOGIN BITCHES</h1>
      )}
    </>
  );
};

export default ErrorPage;
