// pages/api/createDeck.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';
import { FlashcardGenerator } from '../../components/flashcardGenerator'; // Adjust the path as per your project structure

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const busboy = new Busboy({ headers: req.headers });
    let formFields: { [key: string]: any } = {};
    let audioBuffers: Buffer[] = [];
    
    busboy.on('field', (fieldname, val) => {
      formFields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename) => {
      let fileData: any[] = [];
      
      file.on('data', data => {
        fileData.push(data);
      });

      file.on('end', () => {
        if (fieldname === 'list_audio') {
          audioBuffers.push(Buffer.concat(fileData));
        }
      });
    });

    busboy.on('finish', async () => {
      try {
        const flashCardGenerator = new FlashcardGenerator();

        const { deckName, listImageUrl, listSentence, listTranslation, nFlashcard } = formFields;
        const filePath = flashCardGenerator.exportToAnki(deckName, JSON.parse(listImageUrl), JSON.parse(listSentence), JSON.parse(listTranslation), audioBuffers, Number(nFlashcard));
        
        // Send the .apkg file as a response.
        res.setHeader('Content-disposition', 'attachment; filename=' + deckName + '.apkg');
        res.setHeader('Content-type', 'application/octet-stream');
        res.sendFile(filePath);
      } catch (error) {
        res.status(500).send({ error: "Failed to generate deck." });
      }
    });

    return req.pipe(busboy);
  } else {
    res.status(405).send({ error: 'Only POST requests are allowed.' });
  }
};
