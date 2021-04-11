import React from "react";
import "./LevelSelector.css";
import axios from "axios";
import { baseUrl, selectLevel } from "../../config/api";

const LevelSelector = ({ setFileId, setNumberOfCards }) => {
  const selectLevelHandler = (lvl) => {
    axios.get(`${baseUrl}/${selectLevel}/${lvl}`).then((res) => {
      let data = res.data;
      console.log(res);
     if(data){
      setFileId(data.file_id);
      setNumberOfCards(data.number_of_cards);
     }
    }).catch(err=>console.log(err));
  };

  return (
    <div className="LevelSelector">
      <div className=" lead text-light mb-3" style={{ fontSize: "50px" }}>
        Memory Game
      </div>
      <div>Please select game difficulty:</div>
      <div className=" mt-5">
        <span
          className="btn  btn-success mx-3"
          onClick={() => selectLevelHandler("Easy")}
        >
          Easy
        </span>
        <span
          className="btn  btn-warning mx-3"
          onClick={() => selectLevelHandler("Medium")}
        >
          Medium
        </span>
        <span
          className="btn  btn-danger mx-3"
          onClick={() => selectLevelHandler("Hard")}
        >
          Hard
        </span>
      </div>
    </div>
  );
};

export default LevelSelector;
