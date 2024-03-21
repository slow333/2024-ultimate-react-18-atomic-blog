import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App-context";
import App2 from "./App2";
import Test from "./Test";
import AppMemo from "./App-memo";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
