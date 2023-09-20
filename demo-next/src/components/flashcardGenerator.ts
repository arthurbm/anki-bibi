import * as anki from "../lib/genanki";

class FlashcardGenerator {
    createFlashcards(listImageUrl: string[], listSentence: string[], listTranslation: string[], listAudio: string[], nFlashcard: number): Array<{ question: string, answer: string }> {
        const flashcards: Array<{ question: string, answer: string }> = [];
        for (let i = 0; i < nFlashcard; i++) {
            const flashcard = {
                question: `<img src="${listImageUrl[i]}" /><br>${listSentence[i]}`,
                answer: `${listTranslation[i]}<br>[sound:${listAudio[i]}]`,
            };
            flashcards.push(flashcard);
        }
        return flashcards;
    }

    createDeck(deckName: string): [anki.Deck, anki.Model] {
        const idDeck = new Date().getTime();  // Generates unique ID using current timestamp.
        const idModel = idDeck + 1;           // Ensures unique model ID.

        const myDeck = new anki.Deck(idDeck, deckName);

        const noteModel = new anki.Model({
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

    exportToAnki(deckName: string, listImageUrl: string[], listSentence: string[], listTranslation: string[], listAudio: string[], nFlashcard: number): string {
        const [myDeck, noteModel] = this.createDeck(deckName);

        const flashcards = this.createFlashcards(listImageUrl, listSentence, listTranslation, listAudio, nFlashcard);
        for (const flashcard of flashcards) {
            const note = noteModel.note([flashcard.question, flashcard.answer]);
            myDeck.addNote(note);
        }

        const myPackage = new anki.Package();
        myPackage.addDeck(myDeck);
        for (const audio of listAudio) {
            myPackage.addMediaFile(audio);  // Assuming audio paths are provided directly.
        }

        const filePath = `${deckName}.apkg`;
        myPackage.writeToFile(filePath);

        return filePath;
    }
}

export { FlashcardGenerator };
