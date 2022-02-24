import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faArrowUp,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

import Homepage from "./containers/Homepage";
import Header from "./containers/Header";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import MyVideos from "./containers/MyVideos";
import Profile from "./containers/Profile";

library.add(faArrowDown, faArrowUp, faPerson);

function App() {
  const serverUrl = "https://backend-vod.herokuapp.com";
  // const serverUrl = "http://localhost:4000";
  const [userToken, setUserToken] = useState(Cookies.get("token") || null);

  // will use this function to get connection token and log in/out the user with cookies
  const setConnected = (token) => {
    if (token) {
      setUserToken(Cookies.set("token", token));
    } else {
      setUserToken(null);
      Cookies.remove("token");
    }
  };

  return (
    <Router>
      <Header userToken={userToken} setConnected={setConnected} />
      <Routes>
        <Route
          path="/"
          element={<Homepage serverUrl={serverUrl} userToken={userToken} />}
        />
        <Route
          path="/login"
          element={
            <Login
              serverUrl={serverUrl}
              setConnected={setConnected}
              userToken={userToken}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp
              serverUrl={serverUrl}
              setConnected={setConnected}
              userToken={userToken}
            />
          }
        />
        <Route
          path="/myvideos"
          element={<MyVideos userToken={userToken} serverUrl={serverUrl} />}
        />
        <Route
          path="/myprofile"
          element={<Profile userToken={userToken} serverUrl={serverUrl} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
