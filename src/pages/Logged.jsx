import React, { useEffect, useState } from "react";

import Dashboard from "./dashboard";
import CanvasLoader from "./Loader";

const Logged = () => {
  var redirect = "http://localhost:5173/";
  var client_id = "aec754358f954152a4fe97e568905e32";
  var client_secret = "382b7b66b061411b9dcbb6c5fda12feb";
  const TOKEN = "https://accounts.spotify.com/api/token";

  const [datas, setDatas] = useState([]);
  const [metric, setMetric] = useState("tracks");
  const [time, setTime] = useState("medium_term");
  const [isBusy, setBusy] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (window.location.search.length > 0) {
      console.log("1")
      handleRedirect();
    } else {
      console.log("2")
      callApi("GET", request(), null, handleDataResponse);
    }
  }, []);


  function handleRedirect() {
    let code = getCode();
    fetchAccesToken(code);
    window.history.pushState("", "", redirect);
    // setBusy(false);
  }

  function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get("code");
    }
    return code;
  }

  function fetchAccesToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthApi(body);
  }

  function callAuthApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader(
      "Authorization",
      "Basic " + btoa(client_id + ":" + client_secret)
    );
    xhr.send(body);
    xhr.onload = handleAuthResponse;
  }

  function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthApi(body);
  }

  function handleAuthResponse() {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      if (data.access_token != undefined) {
        let access_token = data.access_token;
        localStorage.setItem("access_token", access_token);
      }
      if (data.refresh_token != undefined) {
        let refresh_token = data.refresh_token;
        localStorage.setItem("refresh_token", refresh_token);
      }
      // getData();
    } else {
      console.log(this.responseText);
      alert(this.responseText);
    }
  }

  function request() {
    let body = "https://api.spotify.com/v1/me/top/";
    body += metric;
    body += "?time_range=" + time;
    body += "&limit=10&offset=0";
    return body;
  }

  function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(
      "Authorization",
      "Bearer " + localStorage.getItem("access_token")
    );
    xhr.send(body);
    xhr.onload = callback;
  }

  function handleDataResponse() {
    if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      // console.log(data.items);
      setDatas(data.items);
      setBusy(false);
    } else if (this.status == 401) {
      refreshAccessToken();
    } else {
      console.log(this.responseText);
      alert(this.responseText);
    }
  }

  // function changeMetric(event) {
  //   setBusy(true);
  //   setMetric(event.target.value);
  // }

  function changeTime(event) {
    setBusy(true);
    setTime(event.target.value);
    callApi("GET", request(), null, handleDataResponse);
  }
  const clean_data = ({ datas }) => [
    // depan tengah
    {
      id: 0,
      position: [0, 1.4, 2],
      rotation: [Math.PI / 16, 0, 0],
      url: `${datas[0].album.images[1].url}`,
      song_name: `${datas[0].name}`,
      artist: `${datas[0].artists[0].name}`,
      // duration : `${Math.round(datas[0].duration_ms / 60)}`
    },
    // depan kiri
    {
      id: 1,
      position: [-1.3, 1.4, 2],
      rotation: [Math.PI / 16, 0, 0],
      url: `${datas[1].album.images[1].url}`,
      song_name: `${datas[1].name}`,
      artist: `${datas[1].artists[0].name}`,
      // duration : `${Math.round(datas[1].duration_ms / 1000)/60}`
    },
    //depan kanan
    {
      id: 2,
      position: [1.3, 1.4, 2],
      rotation: [Math.PI / 16, 0, 0],
      url: `${datas[2].album.images[1].url}`,
      song_name: `${datas[2].name}`,
      artist: `${datas[2].artists[0].name}`,
      // duration : `${Math.round(datas[2].duration_ms / 1000)}`
    },
    // kiri ke kanan
    {
      id: 3,
      position: [-2, 0, 2.75],
      rotation: [0, Math.PI / 2, 0],
      url: `${datas[3].album.images[1].url}`,
      song_name: `${datas[3].name}`,
      artist: `${datas[3].artists[0].name}`,
      // duration : `${Math.round(datas[3].duration_ms / 1000)}`
    },
    {
      id: 4,
      position: [-1.8, 0, 1.5],
      rotation: [0, Math.PI / 2.5, 0],
      url: `${datas[4].album.images[1].url}`,
      song_name: `${datas[4].name}`,
      artist: `${datas[4].artists[0].name}`,
      // duration : `${Math.round(datas[4].duration_ms / 1000)}`
    },
    {
      id: 5,
      position: [-1.1, 0, 0.4],
      rotation: [0, Math.PI / 4, 0],
      url: `${datas[5].album.images[1].url}`,
      song_name: `${datas[5].name}`,
      artist: `${datas[5].artists[0].name}`,
      // duration : `${Math.round(datas[5].duration_ms / 1000)}`
    },
    // tengah
    {
      id: 6,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      url: `${datas[6].album.images[1].url}`,
      song_name: `${datas[6].name}`,
      artist: `${datas[6].artists[0].name}`,
      // duration : `${Math.round(datas[6].duration_ms / 1000)}`
    },
    {
      id: 7,
      position: [1.1, 0, 0.4],
      rotation: [0, -Math.PI / 4, 0],
      url: `${datas[7].album.images[1].url}`,
      song_name: `${datas[7].name}`,
      artist: `${datas[7].artists[0].name}`,
      // duration : `${Math.round(datas[7].duration_ms / 1000)}`
    },
    {
      id: 8,
      position: [1.8, 0, 1.5],
      rotation: [0, -Math.PI / 2.5, 0],
      url: `${datas[8].album.images[1].url}`,
      song_name: `${datas[8].name}`,
      artist: `${datas[8].artists[0].name}`,
      // duration : `${Math.round(datas[8].duration_ms / 1000)}`
    },
    {
      id: 9,
      position: [2, 0, 2.75],
      rotation: [0, -Math.PI / 2, 0],
      url: `${datas[9].album.images[1].url}`,
      song_name: `${datas[9].name}`,
      artist: `${datas[9].artists[0].name}`,
      // duration : `${Math.round(datas[9].duration_ms / 1000)}`
    },
  ];
  return (
    <section className="w-full h-screen relative">
      {/* <div className="relative w-full lg:max-w-sm">
          <select
            className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
            onChange={changeMetric}
          >
            <option value="tracks">Top Tracks</option>
            <option value="artists">Top Artists</option>
          </select>
        </div> */}
      <div className="relative w-full lg:max-w-sm">
        <select
          className="absolute top-5 left-5 z-10 py-2 px-7 text-gray-500 bg-white border rounded-md shadow-sm"
          onChange={changeTime}
        >
          <option value="short_term">Last Month</option>
          <option value="medium_term">Last 6 Months</option>
          <option value="long_term">All Time</option>
        </select>
      </div>

      {/* {!isBusy ? (
          metric == "tracks" ? (
            datas.map((data) => (
              <div>
                <img src={`${data.album.images[1].url}`} />
                <p>
                  {data.artists[0].name} - {data.name} -{" "}
                  {Math.round(data.duration_ms / 60) / 100} minutes
                </p>
              </div>
            ))
          ) : (
            datas.map((data) => (
              <div>
                <img src={`${data.images[2].url}`} />
                <p>{data.name}</p>
              </div>
            ))
          )
        ) : (
          <p>Loading</p>
        )} */}
      {isBusy ? (
        <div className="flex justify-center items-center w-full h-full">
          Loading
        </div>
      ) : (
        <div className="h-screen">
          {/* {console.log(datas[0])} */}
          <Dashboard data={clean_data({ datas })} />
          {/* {JSON.stringify(clean_data(datas))} */}
        </div>
      )}
      {/* </div> */}
    </section>
  );
};

export default Logged;
