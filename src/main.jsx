import React from "react";
import ReactDOM from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>
);
