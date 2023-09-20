// src/components/AnkiGenerator.tsx
import axios from "axios";
import React, { useEffect, useRef } from "react";
import initSqlJs from "sql.js";

const AnkiGenerator: React.FC = () => {
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    })
      .then((SQL) => {
        (window as any).SQL = SQL;
        console.log("SQL.js initialized");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const generateDeck = async () => {
    try {
      const formData = new FormData();

      // Extract audio files from the input ref
      const audioFiles = audioInputRef.current?.files;
      if (!audioFiles || audioFiles.length === 0) {
        throw new Error("No audio files selected");
      }

      // Append audio files to the FormData
      for (let i = 0; i < audioFiles.length; i++) {
        formData.append("list_audio", audioFiles[i]);
        console.log(audioFiles[i]);
      }

      // Append the other mocked data to the FormData
      formData.append(
        "list_image_url",
        "https://cdn2.fabbon.com/uploads/article/image/1037/best-layered-haircuts.jpg"
      );
      formData.append(
        "list_image_url",
        "https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633267191_.png"
      );
      formData.append("list_sentence", "I need to cut my hair!");
      formData.append("list_sentence", "I love shopping on Amazon!");
      formData.append("list_translation", "Eu preciso cortar meu cabelo!");
      formData.append("list_translation", "Eu amo comprar na Amazon!");
      formData.append("deck_name", "deck_audio_teste14");
      formData.append("n_flashcard", "2");

      axios
      .post("http://localhost:5000/converter", formData, {
        responseType: "arraybuffer", // for receiving the file as a binary stream
      })
      .then((response) => {
        // Create blob from received data
        const blob = new Blob([response.data], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        // Create download link and click it to start download
        const a = document.createElement("a");
        a.href = url;
        a.download = "deck_audio_teste14.apkg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        alert("Deck created and download initiated!");
      })
      .catch((error) => {
        alert(`API Error: ${error}}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <label>Select audio files:</label>
      <input type="file" ref={audioInputRef} multiple accept=".ogg" />
      <button onClick={generateDeck}>Generate Anki Deck</button>
    </div>
  );
};

export default AnkiGenerator;
