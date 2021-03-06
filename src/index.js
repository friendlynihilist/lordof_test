import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Army,
  Pyre,
  Stronghold,
  Lore,
  Dungeon,
  Ashsmith
} from "./components";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./styles/reset.css";
import "./styles/resp.css";


ReactDOM.render(
  <Provider store={store}>
    <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/lore" element={<Lore />} />
      <Route path="/stronghold" element={<Stronghold />} />
      <Route path="/ashsmith" element={<Ashsmith />} />
      <Route path="/pyre" element={<Pyre />} />
      <Route path="/dungeon" element={<Dungeon />} />
    </Routes>
    <Footer />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
