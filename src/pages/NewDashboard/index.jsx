import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { AppContext } from '../../context/AppContext';
import { Button, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const BACKEND_URL = "http://localhost:8290/upload";

function NewDashboard() {
  const {
    selectedProvider,
    vectorDBAPIKey,
    collectionName,
    embeddingModel,
    embeddingModelAPIKey
  } = useContext(AppContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [chunkingParameter, setChunkingParameter] = useState('sentence');

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [showRequiredIndicators, setShowRequiredIndicators] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
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
    formData.append('file', selectedFile);
    formData.append('selectedProvider', selectedProvider);
    formData.append('vectorDBAPIKey', vectorDBAPIKey);
    formData.append('collectionName', collectionName);
    formData.append('embeddingModel', embeddingModel);
    formData.append('embeddingModelAPIKey', embeddingModelAPIKey);
    formData.append('chunkingParameter', chunkingParameter);

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

    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setUploadMessage(`File upload failed: ${error.message}`);
    }
  };

  return (
    <Box m={5}>
        <Paper>
            <Box p={10}>
                <Typography variant="h4" gutterBottom>
                Add files to vector store
                </Typography>
                <Box {...getRootProps()} border={1} borderRadius={4} mb={2} p={8} textAlign="center" minWidth="400px">
                <input {...getInputProps()} />
                <Typography variant="body1">
                {!selectedFile ? isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or <u>click here</u> to select files</p>
                ) : ""}
                {selectedFile && (
                    <p><b>Selected File:</b> {selectedFile.name}</p>
                )}
                </Typography>
                </Box>
                <FormControl fullWidth required error={showRequiredIndicators && !chunkingParameter}>
                    <InputLabel id="selected-provider-label">Chunking Parameter</InputLabel>
                    <Select
                    value={chunkingParameter}
                    onChange={(e) => setChunkingParameter(e.target.value)}
                    label="Chunking Parameter"
                    labelId="selected-provider-label"
                    >
                        <MenuItem value="sentence">Sentence</MenuItem>
                        <MenuItem value="line">Line</MenuItem>
                        <MenuItem value="paragraph">Paragraph</MenuItem>
                    </Select>
                </FormControl>
                <Box mt={2}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                    >
                    Upload
                    </Button>
                </Box>
                {uploadStatus && (
                <Typography variant="body1" color={uploadStatus === 'success' ? 'green' : 'red'}>
                    {uploadMessage}
                </Typography>
                )}
            </Box>
        </Paper>
    </Box>

  );
}

export default NewDashboard;
