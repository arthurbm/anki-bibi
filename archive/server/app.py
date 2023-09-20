# app.py

from flask import Flask, request, jsonify, send_from_directory, send_file, g
from converter import create_flashcards, create_deck, export_to_anki
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS  # Import the CORS class

app = Flask(__name__)
CORS(app)  # Here we are enabling CORS for all routes

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

        # Now this function returns the file path
        file_path = export_to_anki(deck_name, list_image_url, list_sentence, list_translation, saved_file_names, n_flashcard)

        # Return the generated file to the client
        response = send_file(file_path, as_attachment=True, download_name=os.path.basename(file_path))

        # Store the list of files to be deleted after the request in the global 'g' object
        g.files_to_delete = [file_path] + saved_file_names

        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.after_request
def after_request(response):
    # Check if there's a file to delete
    if hasattr(g, 'files_to_delete'):
        for file_path in g.files_to_delete:
            try:
                os.remove(file_path)
            except Exception as e:
                # Log error (just printing here for demonstration purposes)
                print(f"Error deleting file {file_path}: {e}")
    return response

if __name__ == '__main__':
    app.run(debug=True)
