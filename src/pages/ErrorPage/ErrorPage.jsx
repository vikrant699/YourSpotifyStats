import NavigationBar from "../Navigation/NavigationBar";
import NavigationMenu from "../Navigation/NavigationMenu";

const ErrorPage = () => {
  return (
    <>
      {window.innerWidth > 768 ? <NavigationBar /> : <NavigationMenu />}
      <h1>THIS IS AN ERROR PAGE BOIS</h1>
    </>
  );
};

export default ErrorPage;
