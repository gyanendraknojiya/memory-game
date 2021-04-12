import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import "./GameScreen.css";
import axios from "axios";
import { baseUrl, selectCard, checkMatched } from "../../config/api";

const GameScreen = ({ fileId, numberOfCards, setFileId, setNumberOfCards }) => {
  const generateDeck = (name) => {
    let deck = [];
    for (var i = 1; i <= numberOfCards; i++) {
      let card = {
        position: i,
        deck: name,
        isSelected: false,
        isMatched: false,
        value: null,
      };
      deck.push(card);
    }
    return deck;
  };
  const [deck1, setDeck1] = useState(generateDeck("deck1"));
  const [deck2, setDeck2] = useState(generateDeck("deck2"));
  const [deck1SelectedCard, setDeck1SelectedCard] = useState(null);
  const [deck2SelectedCard, setDeck2SelectedCard] = useState(null);
  const [errorScore, setErrorScore] = useState(0);
  const [matchedCard, setMatchedCard] = useState(0);
  const [time, setTime] = useState(0);

  let sec = 0;
  const timer = () => {
    sec = sec + 1;
    setTime(sec);
    console.log(sec);
  };
  useEffect(() => {
    setInterval(timer, 1000);
  }, []);

  const selectDeckCard = (idx, deckName) => {
    if (deckName === "deck1" && deck1SelectedCard) return;
    if (deckName === "deck2" && (deck2SelectedCard || !deck1SelectedCard)) return;
    axios
      .post(`${baseUrl}/${selectCard}`, {
        file_id: fileId,
        cardIndex: idx,
        deck: deckName,
      })
      .then((res) => {
        let data = res.data;
        console.log(data.selectedCard.value);
        if (deckName === "deck1") {
          deck1[idx - 1]["isSelected"] = true;
          deck1[idx - 1]["value"] = data.selectedCard.value;
          setDeck1([...deck1]);
          setDeck1SelectedCard(idx);
          setTimeout(() => {
            deck1[idx - 1]["value"] = null;
            setDeck1([...deck1]);
          }, 3000);
        }
        if (deckName === "deck2") {
          deck2[idx - 1]["isSelected"] = true;
          deck2[idx - 1]["value"] = data.selectedCard.value;
          setDeck2([...deck2]);
          setDeck2SelectedCard(idx);
          setTimeout(() => {
            deck2[idx - 1]["value"] = null;
            setDeck2([...deck2]);
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (deck1SelectedCard && deck2SelectedCard) {
      axios
        .post(`${baseUrl}/${checkMatched}`, {
          file_id: fileId,
          deck1SelectedCard,
          deck2SelectedCard,
        })
        .then((res) => {
          let isMatched = res.data.isMatched;
          console.log(isMatched);
          if (!isMatched) {
            setErrorScore(errorScore + 1);
            deck1[deck1SelectedCard - 1]["isSelected"] = false;
            setDeck1([...deck1]);
            deck2[deck2SelectedCard - 1]["isSelected"] = false;
            setDeck2([...deck2]);
            console.log(deck1);
          } else {
            deck1[deck1SelectedCard - 1]["isMatched"] = true;
            deck1[deck1SelectedCard - 1]["isSelected"] = false;
            setDeck1([...deck1]);
            deck2[deck2SelectedCard - 1]["isMatched"] = true;
            deck2[deck2SelectedCard - 1]["isSelected"] = false;
            setDeck2([...deck2]);
            console.log(deck1);
            setMatchedCard(matchedCard + 1);
          }
          setDeck1SelectedCard(null);
          setDeck2SelectedCard(null);
        });
    }
  }, [deck1SelectedCard, deck2SelectedCard]);

  return (
    <>
      {matchedCard === numberOfCards ? (
        <div className="game-over">
          <div className="display-4 font-weight-bold text-white">Game Over</div>
          <span
            className="btn btn-light px-5 mt-3 "
            onClick={() => {
              setFileId(null);
              setNumberOfCards(null);
            }}
          >
            Restart
          </span>
        </div>
      ) : (
        <div className="container">
          <div className="mt-3 px-3 ">
            <span className="bg-dark text-light rounded-pill px-3 py-2">
              Elapsed Time: {time} sec
            </span>
            <span className="float-right bg-dark text-light rounded-pill px-3 py-2">
              Error score: {errorScore}
            </span>
          </div>
          <div className="mt-5 text-white">
            <h5>Deck 1</h5>
            <div className="">
              {deck1.map((item) => (
                <Card card={item} deck="deck1" OnClick={selectDeckCard} />
              ))}
            </div>
          </div>
          <div className="mt-5 text-white ">
            <h5>Deck 2</h5>
            <div className="">
              {deck2.map((item) => (
                <Card card={item} deck="deck2" OnClick={selectDeckCard} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameScreen;
