import React, { useEffect, useState, useRef } from "react";
import Bg from "../bg.mp4";
import Navbar from "./Navbar";
import Map from "../earth_daymap.jpg";
import axios from "axios";
import Sidebar from "./Sidebar";
import satellite from "../satellite.png"
import Footer from "./Footer";

function Main() {
  const date = new Date();
  const issElement = useRef(null);
  const [issW, setIssW] = useState(25);
  const [issH, setIssH] = useState(25);
  const curDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const [neoDate, setneoDate] = useState(curDate);
  const [norad, setNorad] = useState("25544U");
  const [satName, setSatName] = useState("");
  const [latlon, setLatlon] = useState([]);
  const [userCoor, setUserCoor] = useState({});
  const [neo, setNeo] = useState([]);
  const [apod, setApod] = useState({});
  const [loader, setLoader] = useState(0);
  const [count, setCount] = useState(0);
  const loaded = document.querySelector(".loaded-results");



// -----CODE THAT HANDLES EMAIL ID SUBMITTED FOR NEWSLETTER-----

  function handleSubmit() {
    const emailInput = document.querySelector("#emailId");
    let emailData = {
      email: emailInput.value,
    };
    axios
      .post(`http://localhost:5000/post`, emailData)
      .then((Res) => {
        if (Res.data.action == true) {
          alert("Respose sent successfully, get ready to dive into space");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }


  // -----USEEFFECT HOOKS USED TO FATCH EXTERNAL API'S-----

  useEffect(() => {
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}`
      )
      .then((Response) => {
        setApod(Response.data);
      });
    setIssH(issElement.current.getBoundingClientRect().height);
    setIssW(issElement.current.getBoundingClientRect().width);

    function handleResize() {
      console.log("resize handler");
      setIssH(issElement.current.getBoundingClientRect().height);
      setIssW(issElement.current.getBoundingClientRect().width);
    }
    window.addEventListener("resize", handleResize);
  }, []);



  // -----FOR DESIGNING LOADER ANIMATION----

  useEffect(() => {
    const loaderObj = document.querySelector(".loader");
    setInterval(() => {
      loaderObj.style.width == "100%"
        ? (loaderObj.style.display = "none")
        : (loaderObj.style.display = "block");
    }, 2000);
  }, [loader]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserCoor(pos.coords);
    });
    setLoader(40);
    axios.get(`https://n2yo-api.vercel.app/${norad}`).then((Response) => {
      setSatName(Response.data.info.satname);
      setLatlon(Response.data.positions);
      setLoader(100);
    });
  }, [norad]);

  useEffect(() => {
    console.log("neo render");
    axios
      .get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoDate}&end_date=${neoDate}&api_key=${process.env.REACT_APP_API_KEY}`
      )
      .then((Response) => {
        setNeo(Object.values(Response.data?.near_earth_objects));
        setLoader(100);
      });
  }, [neoDate]);


  // -----API GIVES SATELLITE POSITIONS FOR NEXT 300 SECONDS IN THE FORM OF ARRAY.
  //     SO WE NEED TO TRAVERSE IT EVERY SECOND TO UPDATE THE CURRENT POSITION 
  //     OF THE SATELLITE.-----



  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    if (count == 250) {
      axios.get(`http://localhost:5000/${norad}`).then((Response) => {
        setLatlon(Response.data.positions);
      });
      setCount(0);
    }

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="main">

    {/* ----PAGE1----- */}


      <div className="page1">

      {/* -----LOADER AND SIDEBAR----- */}

        <div className="loader" style={{ width: `${loader}%` }}></div>
        <Sidebar />
      {/* ---------------------------- */}

        <video src={Bg} autoPlay loop muted></video>
        <div className="hero-section">
          <h1>
            Explore <span className="hero-span">Space.</span>
          </h1>
          <h3>Subscribe to newsletter</h3>
          <div className="email-container">
            <input
              type="email"
              name="email"
              id="emailId"
              placeholder="Enter email"
            />
            <button type="submit" onClick={handleSubmit}>
              Get notified
            </button>
          </div>
          <p>
            Get live updates of satellite positions, Near earth objects, track
            the location of the Asteroids and comets
          </p>
          <p>
            Some intresting pictures took by experts, space news and much more
          </p>
        </div>
        <Navbar />
      </div>


      {/* -----PAGE 2----- */}


      <div className="page2" id="apod">
        <h1 className="hero-head">Astronomy Picture of the day</h1>
        <div className="apod">
          <img src={apod.url} alt="" />
          <div className="apod-description">

          {/* -----ACCESSING THE DATA PRESENT IN APOD STATE----- */}

            <h1>{apod.title}</h1>
            <p>{apod.explanation}</p>
            <h3>
              Copyright: <span className="credit">{apod.copyright}</span>
            </h3>
          </div>
        </div>
      </div>
      <div className="page3" id="satellite">
        <h1 className="page-head">Track satellites</h1>
        <p className="page3P">
          The Satellite Catalog Number (SATCAT, also known as NORAD (North
          American Aerospace Defense) Catalog Number, NORAD ID, USSPACECOM
          object number or simply catalog number, among similar variants) is a
          sequential nine-digit number assigned by the United States Space
          Command (USSPACECOM) in the order of launch or discovery to all
          artificial objects in the orbits of Earth and those that left Earth's
          orbit.
        </p>
        <h3 style={{"marginTop": "20px"}}>Current satellite which is being tracked: {satName} {satName == "SPACE STATION"? <p>(Default)</p>: ""}</h3>
        <div className="search-box">
          <h3>Enter NORAD ID</h3>
          <div className="search-bar">
            <input type="text" placeholder="Enter NORED ID" />
            <button
              type="submit"
              onClick={() => {
                const input = document.querySelector(".search-bar input");
                setNorad(input.value);
              }}
            >
              SUBMIT
            </button>
          </div>
          <a href="https://en.wikipedia.org/wiki/Satellite_Catalog_Number">
            What is NORAD?
          </a>
        </div>
        <div className="grid">
          <div className="map-container">
            <div className="sat-data">
              <p>{satName}</p>
              <p>LATITUDE: {latlon[count]?.satlatitude}</p>
              <p>LONGITUDE: {latlon[count]?.satlongitude}</p>
              <p>ALTITUDE: {latlon[count]?.sataltitude}</p>
              <p>AZIMUTH: {latlon[count]?.azimuth}</p>
              <p>ELEVATION: {latlon[count]?.elevation}</p>
            </div>
            <img className="map" src={Map} alt="" />
            <div className="marker-blank">


            {/* -----I USED ABSOLUTE POSITIONS TO POSITION THE SATELLITE WITH RESPECT TO PARENT(MAP IMAGE)
            AND USING THE SATELLITE POSITIONS GIVEN BY THE API TO UPDATE ITS POSITION DYNAMICALLY----- */}


              <img
                className="iss"
                src={satName == "SPACE STATION"?"https://upload.wikimedia.org/wikipedia/commons/f/f2/ISS_spacecraft_model_1.png": satellite}
                alt=""
                style={{
                  bottom: `calc(${latlon[count]?.satlatitude}% - ${
                    issH / 2
                  }px)`,
                  left: `calc(50% - ${issW / 2}px + (${
                    latlon[count]?.satlongitude
                  }%/2))`,
                  "width":
                  satName == "SPACE STATION"?"10%":"5%"
                }}
                onClick={() => {
                  alert("Name: " + satName);
                }}
                ref={issElement}
              />


              {/* -----SAME LOGIC TO POINT USER CURRENT LOCATION----- */}


              <div
                className="cur-location"
                style={{
                  bottom: `calc(${userCoor?.latitude}% - 5px)`,
                  left: `calc(50% - 5px + (${userCoor?.longitude}%/2))`,
                }}
                onClick={() => {
                  alert(
                    `Your current location\nLatitude: ${userCoor.latitude}\nLongitude: ${userCoor.longitude}`
                  );
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>



      {/* -----PAGE 4----- */}


      <div className="page4" id="neo">
        <h1 className="page-head">Astroids(Neo's)</h1>
        <p>
          A near-Earth object is an asteroid or comet which passes close to the
          Earth's orbit. In technical terms, a NEO is considered to have a
          trajectory which brings it within 1.3 astronomical units of the Sun
          and hence within 0.3 astronomical units, or approximately 45 million
          kilometres, of the Earth's orbit.
        </p>
        <p>
          There are over 32,000 known near-Earth asteroids (NEAs) and over 120
          known short-period near-Earth comets (NECs).
        </p>
        <div className="input-dates">
          <h2>Select date</h2>
          <input type="date" name="neo_date" id="neo-date" />
          <div className="date-submit">


          {/* -----GET INPUT FROM THE USER TO GET DESIRED RESULTS----- */}
            <button
              onClick={() => {
                const nDate = document.getElementById("neo-date");
                setneoDate(nDate.value);
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="neo-results">
          <h1>Near earth objects on {neoDate}</h1>



          {/* -----SLICING THE OBTAINED NUMBER OF RESULTS TO SHOW ONLY 5 RESULTS AT A TIME.
          USING JS SLICE FUNCTION. IF LOAD MORE BUTTON IS CLICKED REST OF THE RESULTS WILL BE SHOWN----- */}


          {neo[0]?.slice(0, 5)?.map((n, i) => {
            return (
              <div className="neo" key={i}>
                <div className="neo-name-hazard">
                  <h2>{n?.name}</h2>
                  {n.is_potentially_hazardous_asteroid ? (
                    <span className="is-hazard">Potentially hazard</span>
                  ) : (
                    <span className="not-hazard">Non hazard</span>
                  )}
                </div>

                <div className="neo-data">
                  <div className="neo-dia">
                    <p>
                      Minimum diameter:{" "}
                      <span
                        className={
                          n.is_potentially_hazardous_asteroid
                            ? "color-red"
                            : "color-green"
                        }
                      >
                        {n.estimated_diameter.kilometers.estimated_diameter_min}{" "}
                        kms
                      </span>
                    </p>
                    <p>
                      Maximum diameter:{" "}
                      <span
                        className={
                          n.is_potentially_hazardous_asteroid
                            ? "color-red"
                            : "color-green"
                        }
                      >
                        {n.estimated_diameter.kilometers.estimated_diameter_max}{" "}
                        kms
                      </span>
                    </p>
                  </div>
                  <div className="neo-approach">
                    <p>
                      Close approach date and time:{" "}
                      <span
                        className={
                          n.is_potentially_hazardous_asteroid
                            ? "color-red"
                            : "color-green"
                        }
                      >
                        {n.close_approach_data[0].close_approach_date_full}
                      </span>
                    </p>
                    <p>
                      Relative velocity:{" "}
                      <span
                        className={
                          n.is_potentially_hazardous_asteroid
                            ? "color-red"
                            : "color-green"
                        }
                      >
                        {
                          n.close_approach_data[0].relative_velocity
                            .kilometers_per_hour
                        }{" "}
                        km/h
                      </span>
                    </p>
                    <p>
                      Miss distence:{" "}
                      <span
                        className={
                          n.is_potentially_hazardous_asteroid
                            ? "color-red"
                            : "color-green"
                        }
                      >
                        {n.close_approach_data[0].miss_distance.kilometers} kms
                      </span>
                      <br />
                      <span
                        className={
                          n.is_potentially_hazardous_asteroid
                            ? "color-red"
                            : "color-green"
                        }
                      >
                        {n.close_approach_data[0].miss_distance.astronomical} A
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="loaded-results">
            {neo[0]?.slice(5, neo[0].length)?.map((n, i) => {
              return (
                <div className="neo" key={i}>
                  <div className="neo-name-hazard">
                    <h2>{n?.name}</h2>
                    {n.is_potentially_hazardous_asteroid ? (
                      <span className="is-hazard">Potentially hazard</span>
                    ) : (
                      <span className="not-hazard">Non hazard</span>
                    )}
                  </div>

                  <div className="neo-data">
                    <div className="neo-dia">
                      <p>
                        Minimum diameter:{" "}
                        <span
                          className={
                            n.is_potentially_hazardous_asteroid
                              ? "color-red"
                              : "color-green"
                          }
                        >
                          {
                            n.estimated_diameter.kilometers
                              .estimated_diameter_min
                          }{" "}
                          kms
                        </span>
                      </p>
                      <p>
                        Maximum diameter:{" "}
                        <span
                          className={
                            n.is_potentially_hazardous_asteroid
                              ? "color-red"
                              : "color-green"
                          }
                        >
                          {
                            n.estimated_diameter.kilometers
                              .estimated_diameter_max
                          }{" "}
                          kms
                        </span>
                      </p>
                    </div>
                    <div className="neo-approach">
                      <p>
                        Close approach date and time:{" "}
                        <span
                          className={
                            n.is_potentially_hazardous_asteroid
                              ? "color-red"
                              : "color-green"
                          }
                        >
                          {n.close_approach_data[0].close_approach_date_full}
                        </span>
                      </p>
                      <p>
                        Relative velocity:{" "}
                        <span
                          className={
                            n.is_potentially_hazardous_asteroid
                              ? "color-red"
                              : "color-green"
                          }
                        >
                          {
                            n.close_approach_data[0].relative_velocity
                              .kilometers_per_hour
                          }{" "}
                          km/h
                        </span>
                      </p>
                      <p>
                        Miss distence:{" "}
                        <span
                          className={
                            n.is_potentially_hazardous_asteroid
                              ? "color-red"
                              : "color-green"
                          }
                        >
                          {n.close_approach_data[0].miss_distance.kilometers}{" "}
                          kms
                        </span>
                        <br />
                        <span
                          className={
                            n.is_potentially_hazardous_asteroid
                              ? "color-red"
                              : "color-green"
                          }
                        >
                          {n.close_approach_data[0].miss_distance.astronomical}{" "}
                          A
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="load-more">
            <button
              onClick={(e) => {
                loaded.classList.toggle("show-more");
              }}
            >
              Show more
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Main;
