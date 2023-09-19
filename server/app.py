from flask import Flask, request, jsonify, send_from_directory, send_file
from converter import create_flashcards, create_deck, export_to_anki
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

@app.route('/converter', methods=['POST'])
def converter_flashcards():
    try:
        # Extracting the form data and files
        list_image_url = request.form.getlist('list_image_url')
        list_sentence = request.form.getlist('list_sentence')
        list_translation = request.form.getlist('list_translation')
        deck_name = request.form['deck_name']
        n_flashcard = int(request.form['n_flashcard'])

        # Extracting audio files
        audio_files = request.files.getlist('list_audio')
        saved_file_names = []
        for audio in audio_files:
            filename = secure_filename(audio.filename)
            audio.save(filename)
            saved_file_names.append(filename)

        # Now, you can use saved_file_names instead of list_audio in the further processing.
        # Ensure to delete or clean up the saved audio files if they're no longer needed.

        # Now this function returns the file path
        file_path = export_to_anki(deck_name, list_image_url, list_sentence, list_translation, saved_file_names, n_flashcard)

        # Return the generated file to the client
        return send_file(file_path, as_attachment=True, download_name=os.path.basename(file_path))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)