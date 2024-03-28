import { useEffect, useState } from "react";

function App() {
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
      console.error(error);
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
        if (index === 2) setSecondCountryInfo(data[0]);
      } else {
        setError(`No data found for ${chosenCountry}.`);
      }
    } catch (error) {
      setError(`Failed to fetch data for ${chosenCountry}.`);
      console.error(error);
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
      console.error(error);
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

  if (error) {
    return <div className="errorr">Error: {error}</div>;
  }

  const handleNextOne = () => {
    setFirstCountry(SecondCountry);
    setSecondCountryInfo(SecondCountryInfo);
    setSecondCountry(AnotherCountry);
    setAnotherCountryInfo(AnotherCountryInfo);
    setChoosed(false);
  };

  const handleTryAgain = () => {
    setGameOver(false);
    setChoosed(false);
    setError(false);
    setFirstCountry(false);
    setFirstCountryInfo(false);
    setSecondCountry(false);
    setSecondCountryInfo(false);
    fetchData();
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleCompare = (value) => {
    setChoosed(true);
    fetchAnotherDataInfo();
    console.log(AnotherCountry);
    setTimeout(() => {
      console.log("Delayed for 1 second.");
      console.log(value, FirstCountryInfo.area, SecondCountryInfo.area);

      if (
        (FirstCountryInfo.area <= SecondCountryInfo.area && value === "more") ||
        (FirstCountryInfo.area >= SecondCountryInfo.area && value === "less")
      ) {
        console.log("git");
        handleNextOne();
      } else {
        console.log("dupa");
        handleGameOver();
      }
    }, "1000");
  };

  const NameFun = (area) => {
    console.log(area);
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
        <p>You can do better</p>
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
            {choosed ? (
              <h3>
                <span>{NameFun(SecondCountryInfo.area) || "Area"} km²</span>
              </h3>
            ) : (
              <div className="buttonContainer">
                <button className="less" onClick={() => handleCompare("less")}>
                  smaller
                </button>
                <button className="more" onClick={() => handleCompare("more")}>
                  bigger
                </button>
              </div>
            )}
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
