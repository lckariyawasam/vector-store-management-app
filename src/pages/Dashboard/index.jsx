import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import './styles.css'

const BACKEND_URL = "http://localhost:5000/upload"

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [chunkingParameter, setChunkingParameter] = useState('sentence');

  const onDrop = useCallback(acceptedFiles => {
    setSelectedFile(acceptedFiles[0]);
    setUploadMessage("");
    setUploadStatus("")
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('error');
      setUploadMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('file', selectedFile);

    setUploadStatus('uploading');
    setUploadMessage('Uploading...');

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} - ${errorText || 'File upload failed'}`);
      }

      const data = await response.json();
      setUploadStatus('success');
      setUploadMessage('File uploaded successfully!');
      console.log('File uploaded successfully:', data);

      setSelectedFile(null);
      setDescription('');

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setUploadMessage(`File upload failed: ${error.message}`);
    }
  };

  return (
    <div className='document-upload-section'>
      <form onSubmit={handleSubmit}>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {!selectedFile ? isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or <u>click here</u> to select files</p>
          ): ""}
          {selectedFile && (
             <p><b>Selected File:</b> {selectedFile.name}</p>
          )}
        </div>

        <div className='input-section'>
          <label htmlFor="chunking">Chunking Parameter:</label>
          <select id="chunking" value={chunkingParameter} onChange={(e) => setChunkingParameter(e.target.value)}>
            <option value="sentence">Sentence</option>
            <option value="paragraph">Paragraph</option>
            <option value="page">Page</option>
          </select>
        </div>

        <div className="">
          <button type="submit" className='upload-button'>Upload</button>

          {uploadStatus && (
            <div className={`upload-status ${uploadStatus}`}>
              {uploadMessage}
            </div>
          )}
        </div>

      </form>
    </div>
  );
}

export default Dashboard;
