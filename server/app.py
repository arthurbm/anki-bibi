from flask import Flask, request, jsonify
from converter import create_flashcards, create_deck, export_to_anki

app = Flask(__name__)

@app.route('/converter', methods=['POST'])
def converter_flashcards():
    try:
        # Receba os dados dos flashcards da solicitação POST em JSON
        data = request.json

        # Extraia os dados da solicitação
        list_image_url = data['list_image_url']
        list_sentence = data['list_sentence']
        list_translation = data['list_translation']
        list_audio = data['list_audio']
        deck_name = data['deck_name']
        n_flashcard = data['n_flashcard']

        # Chame suas funções em converter.py para exportar para .apkg
        export_to_anki(deck_name, list_image_url, list_sentence, list_translation, list_audio, n_flashcard)

        return jsonify({"message": "Flashcards exportados com sucesso para o formato .apkg"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
