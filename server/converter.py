import genanki
import random
import os

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


def export_to_anki(deck_name, list_image_url, list_sentence, list_translation, list_audio, n_flashcard):
    # Create the deck
    my_deck, note_model = create_deck(deck_name, n_flashcard)

    # Add note model to the deck
    my_deck.add_model(note_model)

    # Create and add the flashcards to the deck
    my_flashcards = create_flashcards(list_image_url, list_sentence, list_translation, list_audio, n_flashcard)
    for flashcard in my_flashcards:
        my_note = genanki.Note(
            model=note_model,
            fields=[flashcard['question'], flashcard['answer']]
        )
        my_deck.add_note(my_note)

    # Use list_audio for the media files
    my_package = genanki.Package(my_deck)
    my_package.media_files = list_audio

    # Define the path for the .apkg file
    file_path = os.path.join(os.getcwd(), f'{deck_name}.apkg')

    # Save the .apkg file to the path
    my_package.write_to_file(file_path)

    # Return the path of the generated file
    return file_path