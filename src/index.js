import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import GamerProfile from "./Components/GamerProfile";
import Navbar from "./Components/Navbar";
import ErrorPage from "./Components/ErrorPage";
import Posts from "./Components/Posts";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { GamersContext } from "./Components/Contexts/GamersContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
require("dotenv").config();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GamersContext>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/">
              <App />
            </Route>
            <Route path="/posts">
              <Posts />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/profile/:id" children={<GamerProfile />} />
            <Route path="*">
              <ErrorPage />
            </Route>
          </Switch>
        </Router>
      </GamersContext>
    </ThemeProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
