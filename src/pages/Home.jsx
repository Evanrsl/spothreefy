import React, { useState, useEffect } from "react";
import axios from "axios";
import Logged from "./Logged";
import { NavLink } from "react-router-dom";


const Home = () => {
  var redirect = "http://localhost:5173/";

  var client_id = "aec754358f954152a4fe97e568905e32";
  var client_secret = "382b7b66b061411b9dcbb6c5fda12feb";

  const AUTHORIZE = "https://accounts.spotify.com/authorize";

  function authorize() {
    {console.log("Test")}
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url +=
      "&scope=user-read-private user-read-email user-read-playback-state user-top-read";
    
    return url;
  }
  const code = new URLSearchParams(window.location.search).get("code");

  return code ? (
    <div>
      <Logged />
    </div>
  ) : (
    <section className="w-full h-screen ">
      <div className="absolute top-10 left-0 right-0 z-10 flex items-center justify-center flex-col">
        <h1 className="text-white font-black text-[60px]">Spothreefy</h1>
        <h2 className="text-[30px] text-secondary">Top Tracks Generator</h2>
        <a className="text-[20px] text-white bg-green-500 m-10 p-5 rounded-xl" href={authorize()}>Login to Spotify</a>
        {/* <NavLink to="/logged">logged</NavLink> */}
      </div>
    </section>
  );
};

export default Home;
