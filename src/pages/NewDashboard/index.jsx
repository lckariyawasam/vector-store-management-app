import React, { useState, useCallback, useContext, useEffect } from 'react';
import './styles.css'
import { useDropzone } from 'react-dropzone';
import { AppContext } from '../../context/AppContext';
import { Button, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = "http://localhost:5000/upload";

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

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  useEffect(() => {
    selectedFile && setUploadMessage("")
  }, [selectedFile])

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
    <>
    <Box mt={5}>
        <Paper>
            <Box px={10} pt={3} sx={{display: "flex", flexDirection: "column", justifyItems: "center"}}>
                <Typography m={1} variant="h4" gutterBottom>
                    Vector Store Settings
                </Typography>
                <Box mt={3} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px"}}>
                    <Grid xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="selected-provider-label">Vector Database Provider</InputLabel>
                            <Select
                            value={selectedProvider}
                            disabled
                            label="Vector Database Provider"
                            labelId="selected-provider-label"

                            >
                            <MenuItem value="PineconeDB">Pinecone DB</MenuItem>
                            <MenuItem value="ChromaDB">Chroma</MenuItem>
                            <MenuItem value="Weviate">Weviate</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        label="Collection Name"
                        value={collectionName}
                        disabled
                        fullWidth
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="embedding-model-label">Embedding Model</InputLabel>
                        <Select
                        value={embeddingModel}
                        disabled
                        labelId='embedding-model-label'
                        label='Embedding Model'
                        >
                        <MenuItem value="SENTENCE_TRANSFORM">Sentence Transform</MenuItem>
                        <MenuItem value="OPENAI">OpenAI</MenuItem>
                        <MenuItem value="MODEL2">Azure OpenAI</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {navigate("/")}}
                    >
                        Edit
                    </Button>
                    </Grid>
                </Box>
    </Box>
            <Box px={10} py={5}>
                <Typography mx={1} mb={3} variant="h4" gutterBottom>
                Add files to vector store
                </Typography>
                <Box {...getRootProps()} className={`dropzone ${isDragActive || selectedFile ? 'active' : ''}`} border={1} borderRadius={4} mb={2} p={8} textAlign="center" minWidth="400px">
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
                <FormControl fullWidth >
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
                    >
                    Upload
                    </Button>
                </Box>
                {uploadStatus && (
                <Typography variant="body1" mt={1} color={uploadStatus === 'success' ? 'green' : 'red'}>
                    {uploadMessage}
                </Typography>
                )}
            </Box>
        </Paper>
    </Box>
    </>

  );
}

export default NewDashboard;
