import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import ScoreText from "./ScoreText";

function App() {
  gsap.registerPlugin(useGSAP, TextPlugin);
  const UsaFlag = "url('https://flagcdn.com/w320/us.png')";
  const [FirstCountry, setFirstCountry] = useState("");
  const [FirstCountryInfo, setFirstCountryInfo] = useState(null);
  const [SecondCountry, setSecondCountry] = useState("");
  const [SecondCountryInfo, setSecondCountryInfo] = useState(null);
  const [AnotherCountry, setAnotherCountry] = useState("");
  const [AnotherCountryInfo, setAnotherCountryInfo] = useState(null);
  const [error, setError] = useState(null);
  const [choosed, setChoosed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [score, setScore] = useState(0);

  const lowerref = useRef();
  const upperref = useRef();

  useGSAP(
    () => {
      gsap.to(lowerref.current, {
        duration: 0.95,
        delay: 0.25,
        text: newSize,
        ease: "back.out",
      });
    },
    { dependencies: [choosed], revertOnUpdate: true }
  );

  async function fetchData() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomCountry = data[randomIndex];
      const name = randomCountry.name.common;
      setFirstCountry(name);
      const secondRandomIndex = Math.floor(Math.random() * data.length);
      const secondRandomCountry = data[secondRandomIndex];
      const secondName = secondRandomCountry.name.common;
      setSecondCountry(secondName);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    }
  }

  async function fetchSingleData(chosenCountry, index) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${chosenCountry}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        if (index === 1) setFirstCountryInfo(data[0]);
        if (index === 2) {
          setSecondCountryInfo(data[0]);
          setNewSize(`${NameFun(data[0].area.toString())} km²    `);
        }
      } else {
        setError(`No data found for ${chosenCountry}.`);
      }
    } catch (error) {
      setError(`Failed to fetch data for ${chosenCountry}.`);
    }
  }

  async function fetchAnotherDataInfo() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomCountry = data[randomIndex];
    const name = randomCountry.name.common;
    setAnotherCountry(name);
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${name}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setAnotherCountryInfo(data[0]);
      } else {
        setError(`No data found for ${name}.`);
      }
    } catch (error) {
      setError(`Failed to fetch data for ${name}.`);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (FirstCountry) {
      fetchSingleData(FirstCountry, 1);
    }
    if (SecondCountry) {
      fetchSingleData(SecondCountry, 2);
    }
  }, [FirstCountry, SecondCountry]);

  useEffect(() => {
    fetchAnotherDataInfo();
  }, [FirstCountry, SecondCountry]);

  if (error) {
    return <div className="errorr">Error: {error}</div>;
  }

  const handleNextOne = () => {
    setFirstCountry(SecondCountry);
    setScore((prev) => prev + 1);
    setSecondCountryInfo(SecondCountryInfo);
    // setNewSize(SecondCountryInfo.area.toString());
    setSecondCountry(AnotherCountry);
    setAnotherCountryInfo(AnotherCountryInfo);
    setChoosed(false);
  };

  const handleTryAgain = () => {
    setGameOver(false);
    setChoosed(false);
    setScore(0);
    setError(false);
    setFirstCountry(false);
    setFirstCountryInfo(false);
    setSecondCountry(false);
    setSecondCountryInfo(false);
    fetchData();
  };

  const handleGameOver = () => {
    setChoosed(false);
    setGameOver(true);
  };

  const handleCompare = (value) => {
    setChoosed(true);
    fetchAnotherDataInfo();
    setTimeout(() => {
      if (
        (FirstCountryInfo.area <= SecondCountryInfo.area && value === "more") ||
        (FirstCountryInfo.area >= SecondCountryInfo.area && value === "less")
      ) {
        handleNextOne();
      } else {
        handleGameOver();
      }
    }, "1000");
  };

  const NameFun = (area) => {
    let numStr = area.toString();
    if (numStr.includes(".")) {
      return area;
    }
    let newtab = [];
    for (let i = numStr.length; i > 0; i -= 3) {
      let chunk = numStr.slice(Math.max(0, i - 3), i);
      newtab.unshift(chunk);
    }
    let spacedNum = newtab.join(" ");
    return spacedNum;
  };
  const styleh1 = {
    letterSpacing: "10px",
  };
  if (gameOver) {
    return (
      <div className="GameOverScreen">
        <h1 style={styleh1}>GAME OVER</h1>
        <p>Score: {score}</p>
        <ScoreText score={score} />
        <button className="more tryAgain" onClick={() => handleTryAgain()}>
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <h1>More or less</h1>
        <h2>Score: {score}</h2>
        <div className="container">
          <div className="versus">VS</div>
          <div
            className="country first"
            style={{
              backgroundImage: FirstCountryInfo
                ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
                    FirstCountryInfo.flags ? FirstCountryInfo.flags.png : ""
                  })`
                : "",
            }}>
            <h2>
              {FirstCountryInfo
                ? FirstCountryInfo.name.common || "Country"
                : "Loading..."}
            </h2>
            <p>is</p>
            <h3>
              <span>
                {FirstCountryInfo
                  ? `${NameFun(FirstCountryInfo.area) || "Area"} km²`
                  : "Loading..."}
              </span>
            </h3>
            <p>in total area</p>
          </div>
          <div
            className="country second"
            ref={upperref}
            style={{
              backgroundImage: SecondCountryInfo
                ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
                    SecondCountryInfo.flags ? SecondCountryInfo.flags.png : ""
                  })`
                : "",
            }}>
            <h2>
              {SecondCountryInfo
                ? `${SecondCountryInfo.name.common || "Country"}`
                : "Loading..."}
            </h2>
            <p>is</p>
            <div className="overlayButtons">
              {choosed ? (
                <h3>
                  <span className="AreaInfo" ref={lowerref}>
                    XX XXX XXX km²
                  </span>
                </h3>
              ) : (
                // {NameFun(newSize) || "Area"}
                <div className="buttonContainer">
                  <button
                    className="less"
                    onClick={() => handleCompare("less")}>
                    smaller
                  </button>
                  <button
                    className="more"
                    onClick={() => handleCompare("more")}>
                    bigger
                  </button>
                </div>
              )}
            </div>
            <p>in Total Area</p>
          </div>

          <div
            className="country third"
            style={{ backgroundImage: UsaFlag }}></div>
        </div>
      </div>
    </>
  );
}

export default App;
