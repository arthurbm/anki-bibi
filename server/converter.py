import genanki
import random

def create_flashcards (list_image_url, list_sentence, list_translation, list_audio, n_flashcard):
  #cria conjunto de flashcards
  my_flashcards = []
  for i in range(n_flashcard):
    #estrutura de um flashcard
    flashcard = {
            'question': f'<img src="{list_image_url[i]}" /><br>{list_sentence[i]}',
            'answer': f'{list_translation[i]}<br>[sound:{list_audio[i]}]',
        }
    #adiciona flashcard na lista
    my_flashcards.append(flashcard)
  return my_flashcards


def create_deck (deck_name, n_flashcard):

  #gerar id aleatório
  id_deck = random.getrandbits(9)
  id_model = random.getrandbits(9)

  # Criar deck do anki
  my_deck = genanki.Deck(
      id_deck,  # Use um ID único
      f'{deck_name}'
  )

  # Criar note model
  note_model = genanki.Model(
      id_model,  # Use um ID único
      'Simple Model with Media',
      fields=[
          {'name': 'Question'},
          {'name': 'Answer'},
      ],
      templates=[
          {
              'name': 'Card 1',
              'qfmt': '{{Question}}',
              'afmt': '{{FrontSide}}<hr id="answer">{{Answer}}',
          },
      ])
  return my_deck, note_model


def export_to_anki (deck_name, list_image_url, list_sentence, list_translation,  list_audio, n_flashcard):

  #Crie o deck
  my_deck, note_model = create_deck (deck_name, n_flashcard)
  # Adicione note model ao deck
  my_deck.add_model(note_model)

  # Crie e adicione os flashcards ao deck
  my_flashcards = create_flashcards(list_image_url, list_sentence, list_translation, list_audio, n_flashcard)
  for flashcard in my_flashcards:
      my_note = genanki.Note(
          model=note_model,
          fields=[flashcard['question'], flashcard['answer']]
      )
      my_deck.add_note(my_note)

  # Exporta o deck como um .apkg
  my_package = genanki.Package(my_deck)
  my_package.media_files = ['audio1.ogg', 'audio2.ogg']
  my_package.write_to_file(f'{deck_name}.apkg')