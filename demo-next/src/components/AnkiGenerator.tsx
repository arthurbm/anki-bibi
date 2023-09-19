// src/components/AnkiGenerator.tsx
declare module "../lib/genanki.js";
import React, { useEffect } from "react";
import { Model, Deck, Package } from "../lib/genanki.js";
import initSqlJs from "sql.js";

// Declare global classes so TypeScript recognizes them
// declare const Model: any;
// declare const Deck: any;
// declare const Package: any;

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
      const m = new Model({
        name: "Basic (and reversed card)",
        id: "1543634829843",
        flds: [{ name: "Front" }, { name: "Back" }],
        req: [
          [0, "all", [0]],
          [1, "all", [1]],
        ],
        tmpls: [
          {
            name: "Card 1",
            qfmt: "{{Front}}",
            afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}",
          },
          {
            name: "Card 2",
            qfmt: "{{Back}}",
            afmt: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Front}}",
          },
        ],
      });

      const d = new Deck(1276438724672, "Test Deck");
      d.addNote(m.note(["this is front", "this is back"]));

      const p = new Package();
      p.addDeck(d);
      console.log(p);
      p.writeToFile("deck.apkg");
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
