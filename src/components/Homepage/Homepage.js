import React, { useState } from "react";

import "./Homepage.css";
import LevelSelector from "../LevelSelector/LevelSelector";
import GameScreen from "../GameScreen/GameScreen";

const Homepage = () => {
  const [fileId, setFileId] = useState(null);
  const [numberOfCards, setNumberOfCards] = useState(null);

  return (
    <div>
      {fileId && numberOfCards ? (
        <GameScreen fileId={fileId} setFileId={setFileId} setNumberOfCards={setNumberOfCards} numberOfCards={numberOfCards} />
      ) : (
        <LevelSelector
          setFileId={setFileId}
          setNumberOfCards={setNumberOfCards}
        />
      )}
    </div>
  );
};

export default Homepage;
