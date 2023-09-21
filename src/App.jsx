import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./pages/Navigation/Navigation";
import HomePage from "./pages/HomePage/HomePage";
import YourTopSongs from "./pages/YourTopSongs/YourTopSongs";
import { getUserTopItems } from "./loaders/loaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "topSongs",
        element: <YourTopSongs />,
        loader: getUserTopItems,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
