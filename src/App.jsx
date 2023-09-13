import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";
import HomePage from "./pages/HomePage/HomePage";
import YourTopSongs from "./pages/YourTopSongs/YourTopSongs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "topSongs",
        element: <YourTopSongs />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
