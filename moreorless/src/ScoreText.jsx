import React from "react";

const ScoreText = ({ score }) => {
  if (score < 4) return <p>Quite bad score!</p>;

  if (score < 8) return <p>Average score!</p>;

  if (score < 12) return <p>Quite good score!</p>;

  if (score > 16) return <p>really good score!</p>;
};

export default ScoreText;
