import React, { useState } from 'react';
import axios from 'axios';

function FileUploader() {
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleSubmit = async () => {
        const form = new FormData();

        // Add metadata like this
        form.append('deck_name', 'deck_audio_teste14');
        // ...

        // Append audio files to the FormData
        for (const file of selectedFiles) {
            form.append('list_audio', file);
        }

        try {
            const response = await axios.post('http://localhost:5000/converter', form, {
                responseType: 'blob', // for receiving the file as a blob
            });

            // Optional: Trigger file download in the browser
            const blobURL = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = blobURL;
            link.setAttribute('download', 'deck_audio_teste14.apkg'); // specify the download file name here
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload and Convert</button>
        </div>
    );
}

export default FileUploader;
