import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";
import HomePage from "./pages/HomePage/HomePage";
import YourTopSongs from "./pages/YourTopSongs/YourTopSongs";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    errorElement: <ErrorPage />,
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
