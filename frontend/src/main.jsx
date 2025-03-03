import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ForecastProvider } from "./context/ForecastContext";
import './index.css'
ReactDOM.createRoot(document.getElementById("root")).render(
  <ForecastProvider>
    <App />
  </ForecastProvider>
);
