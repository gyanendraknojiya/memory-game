const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
var cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const createRandomDeck = (length) => {
  let temp = [];
  while (temp.length < length) {
    let number = Math.floor(Math.random() * length + 1);
    console.log(number);
    if (!temp.includes(number)) {
      temp.push(number);
    }
  }
  let deck = [];
  temp.map((item, idx) => {
    let card = {};
    card["index"] = idx;
    card["value"] = item;
    card["is_Matched"] = false;
    deck.push(card);
  });

  return deck;
};

app.get("/", (req, res) => {
  res.send("<h1>Memory game</h1>");
});

app.get("/selectLevel/:level", (req, res) => {
  let level = req.params.level;
  let file_id = uuidv4();

  let number_of_cards = 0;
  if (level === "Easy") {
    number_of_cards = 5;
  } else if (level === "Medium") {
    number_of_cards = 10;
  } else {
    number_of_cards = 25;
  }

  let deck1 = createRandomDeck(number_of_cards);
  let deck2 = createRandomDeck(number_of_cards);
  let file = {
    deck1: deck1,
    deck2: deck2,
  };

  fs.writeFile(
    "./game-boards/" + file_id + ".json",
    JSON.stringify(file),
    (err) => console.log(err)
  );
  res.send({ file_id, number_of_cards });
});

app.post("/selectCard", (req, res) => {
  let file_id = req.body.file_id;
  let position = req.body.cardIndex;
  let deck = req.body.deck;
  let selectedCard = {};
  const file = fs.readFileSync("./game-boards/" + file_id + ".json");

  let data = JSON.parse(file);
  data[deck].map((card, idx) => {
    console.log(idx, position);
    if (idx + 1 === position) {
      selectedCard = card;
      return selectedCard;
    }
    console.log(selectedCard);
  });

  res.send({ selectedCard });
});

app.post("/checkMatched", (req, res) => {
  let file_id = req.body.file_id;
  let deck1SelectedCard = req.body.deck1SelectedCard;
  let deck2SelectedCard = req.body.deck2SelectedCard;
  let Card1 = null;
  let card2 = null;
  let isMatched = false;
  const file = fs.readFileSync("./game-boards/" + file_id + ".json");

  let data = JSON.parse(file);
  data.deck1.map((card, idx) => {
    if (idx + 1 === deck1SelectedCard) {
      card1 = card.value;
      return card1;
    }
  });
  data.deck2.map((card, idx) => {
    if (idx + 1 === deck2SelectedCard) {
      card2 = card.value;
      return card2;
    }
  });
  if (card1 === card2) {
    isMatched = true;
  }

  res.send({ isMatched });
});

app.listen(4000, () => {
  console.log("server is running at port 4000");
});
