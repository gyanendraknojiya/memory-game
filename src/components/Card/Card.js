import React from "react";

import "./Card.css";

const Card = ({ card, deck, OnClick }) => {
  return (
    <span
      className="deck-card  display-4 text-dark" style={{visibility: card.isMatched? "hidden":"visible", transform: card.isSelected?"scale(1.1)":null}}
      onClick={() => OnClick(card.position, deck)}
    > <span className="card-value" >{card.value}</span>
    </span>
  );
};
    
export default Card;
