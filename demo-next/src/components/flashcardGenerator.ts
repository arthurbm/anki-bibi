import { Model, Deck, Package } from "../lib/genanki";
import * as fs from "fs";

class FlashcardGenerator {
  createFlashcards(listImageUrl: string[], listSentence: string[], listTranslation: string[], audioFiles: Buffer[], nFlashcard: number): Array<{ question: string, answer: string, audio: Buffer }> {
    const flashcards: Array<{ question: string, answer: string, audio: Buffer }> = [];
    for (let i = 0; i < nFlashcard; i++) {
      const audioFileName = `audio_${i}.mp3`;
      const flashcard = {
        question: `<img src="${listImageUrl[i]}" /><br>${listSentence[i]}`,
        answer: `${listTranslation[i]}<br>[sound:${audioFileName}]`,
        audio: audioFiles[i]
      };
      flashcards.push(flashcard);
    }
    return flashcards;
  }

  createDeck(deckName: string): [Deck, Model] {
    const idDeck = new Date().getTime();  // Generates unique ID using current timestamp.
    const idModel = idDeck + 1;           // Ensures unique model ID.

    const myDeck = new Deck(idDeck, deckName);

    const noteModel = new Model({
      id: idModel.toString(),
      name: "Simple Model with Media",
      flds: [{ name: "Question" }, { name: "Answer" }],
      tmpls: [{
        name: "Card 1",
        qfmt: "{{Question}}",
        afmt: "{{FrontSide}}<hr id='answer'>{{Answer}}"
      }]
    });

    return [myDeck, noteModel];
  }

  exportToAnki(deckName: string, listImageUrl: string[], listSentence: string[], listTranslation: string[], audioFiles: Buffer[], nFlashcard: number): string {
    const [myDeck, noteModel] = this.createDeck(deckName);

    const flashcards = this.createFlashcards(listImageUrl, listSentence, listTranslation, audioFiles, nFlashcard);

    const myPackage = new Package(); // Moved outside the loop
    myPackage.addDeck(myDeck);

    for (const flashcard of flashcards) {
      const note = noteModel.note([flashcard.question, flashcard.answer]);
      myDeck.addNote(note);

      // Write the audio buffer to a temporary file to be added to the package
      const audioFileName = `audio_${flashcards.indexOf(flashcard)}.mp3`;
      fs.writeFileSync(audioFileName, flashcard.audio);

      // Add the temporary audio file to the package
      myPackage.addMediaFile(audioFileName);

      // Clean up and delete the temporary audio file
      fs.unlinkSync(audioFileName);
    }

    const filePath = `${deckName}.apkg`;
    myPackage.writeToFile(filePath);

    return filePath;
  }
}

export { FlashcardGenerator };
