import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const form = new FormData();

form.append('list_image_url', 'https://cdn2.fabbon.com/uploads/article/image/1037/best-layered-haircuts.jpg');
form.append('list_image_url', 'https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633267191_.png');
form.append('list_sentence', 'I need to cut my hair!');
form.append('list_sentence', 'I love shopping on Amazon!');
form.append('list_translation', 'Eu preciso cortar meu cabelo!');
form.append('list_translation', 'Eu amo comprar na Amazon!');
form.append('deck_name', 'deck_audio_teste14');
form.append('n_flashcard', '2');

// Append audio files to the FormData
form.append('list_audio', fs.createReadStream('audio1.ogg'));
form.append('list_audio', fs.createReadStream('audio2.ogg'));

axios
  .post('http://localhost:5000/converter', form, {
    responseType: 'arraybuffer', // for receiving the file as a binary stream
  })
  .then((response) => {
    // Save the file to disk
    const fileName = 'deck_audio_teste14.apkg';
    fs.writeFileSync(fileName, response.data);
    console.log(`File saved as ${fileName}`);
  })
  .catch((error) => {
    console.error('API Error:', error);
  });
