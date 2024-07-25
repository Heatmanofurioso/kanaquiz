import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./components/App/App";

let appEl = document.getElementById("app");
if (!appEl) {
  // in case of old index.html in cache
  appEl = document.querySelector(".app");
}

ReactDOM.render(<App/>, document.getElementById('root'));
