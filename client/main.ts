import axios from 'axios';

const data = {
  list_image_url: [
    'https://cdn2.fabbon.com/uploads/article/image/1037/best-layered-haircuts.jpg',
    'https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633267191_.png',
  ],
  list_sentence: ['I need to cut my hair!', 'I love shopping on Amazon!'],
  list_translation: ['Eu preciso cortar meu cabelo!', 'Eu amo comprar na Amazon!'],
  list_audio: ['audio1.ogg', 'audio2.ogg'],
  deck_name: 'deck_audio_teste14',
  n_flashcard: 2,
};

axios
  .post('http://localhost:5000/converter', data)
  .then((response) => {
    console.log('API Response:', response.data);
  })
  .catch((error) => {
    console.error('API Error:', error);
  });
