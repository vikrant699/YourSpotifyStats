import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import NavigationMenu from "./NavigationMenu";

const Navigation = () => {
  return (
    <>
      {window.innerWidth > 830 ? <NavigationBar /> : <NavigationMenu />}
      <Outlet />
    </>
  );
};

export default Navigation;
