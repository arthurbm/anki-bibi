// src/components/AnkiGenerator.tsx
declare module "../lib/genanki.js";
import React, { useEffect } from "react";
import { Model, Deck, Package } from "../lib/genanki.js";
import initSqlJs from "sql.js";
import { FlashcardGenerator } from "./flashcardGenerator.js";

const AnkiGenerator: React.FC = () => {
  useEffect(() => {
    initSqlJs({
      // Fetch sql.js wasm file from CDN
      // This way, we don't need to deal with webpack
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    })
      .then((SQL) => {
        (window as any).SQL = SQL;
        console.log("SQL.js initialized");
        console.log(SQL);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const generateDeck = () => {
    try {
      const flashcardGen = new FlashcardGenerator();
  
      // Using the provided mock data.
      const listImageUrl = [
        "https://cdn2.fabbon.com/uploads/article/image/1037/best-layered-haircuts.jpg",
        "https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633267191_.png"
      ];
      const listSentence = [
        "I need to cut my hair!",
        "I love shopping on Amazon!"
      ];
      const listTranslation = [
        "Eu preciso cortar meu cabelo!",
        "Eu amo comprar na Amazon!"
      ];
      // I'm using placeholders for the audio URLs. You should replace these with actual URLs.
      const listAudio = [
        "path_or_url_to_audio1.ogg",
        "path_or_url_to_audio2.ogg"
      ];
      const deckName = "deck_audio_teste14";
      const nFlashcard = 2;
  
      flashcardGen.exportToAnki(deckName, listImageUrl, listSentence, listTranslation, listAudio, nFlashcard);
  
      console.log("Deck generated successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div>
      <button onClick={generateDeck}>Generate Anki Deck</button>
    </div>
  );
};

export default AnkiGenerator;
