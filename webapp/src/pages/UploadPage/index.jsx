import React, { useState, useCallback, useContext, useEffect } from 'react';
import './styles.css'
import { useDropzone } from 'react-dropzone';
import { AppContext } from '../../context/AppContext';
import { Button, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = "http://localhost:8000";

function UploadPage() {
  const {
    selectedProvider,
    vectorDBAPIKey,
    collectionName,
    embeddingModel,
    embeddingModelAPIKey,
    chromaURL
  } = useContext(AppContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [chunkingStrategy, setChunkingStrategy] = useState('Recursive');
  const [maxSegmentSize, setMaxSegmentSize] = useState(1000);
  const [maxOverlapSize, setMaxOverlapSize] = useState(200);
  const [isInputFile, setIsInputFile] = useState(true);
  const [inputText, setInputText] = useState("");
  const [fileType, setFileType] = useState("text");

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    const fileExtension = file.name.split('.').pop();
    setFileType(fileExtension);
  }, []);

  // Return to setup screen if details are missing
  useEffect(() => {
    if (selectedProvider === "" || embeddingModel === "" || collectionName === "") {
      navigate("/")
    }
  }, [])

  useEffect(() => {
    selectedFile && setUploadMessage("")
  }, [selectedFile])

  useEffect(() => {
    console.log(fileType);
  }, [fileType])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTextChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  }

  const handleInputTypeChange = () => {
    setInputText("")
    if (isInputFile) {
      setFileType("text");
    } else {
      setFileType("")
      setSelectedFile(null)
    }
    setIsInputFile(!isInputFile);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if ((!selectedFile && isInputFile)) {
      setUploadStatus('error');
      setUploadMessage('Please select a file.');
      return;
    } else if (inputText === "" && !isInputFile) {
      setUploadStatus('error');
      setUploadMessage('Please add a text input');
      return;
    } else if (fileType !== "pdf" && fileType !== "text" && fileType !== "markdown" && fileType !=="xls" && fileType !== "xlsx" && fileType !== "doc" && fileType !== "docx" && fileType !== "ppt" && fileType !== "pptx" && fileType !== "html") {
      setUploadStatus('error');
      setUploadMessage('File type not supported')
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Uploading...');

    try {
      const requestId = uuidv4();
      const setupResponse = await fetch(`${BACKEND_URL}/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          file_count: 1,
          vectordb_provider: selectedProvider,
          pinecone_apikey: vectorDBAPIKey,
          chroma_url: chromaURL,
          chroma_port: null,
          postgres_host: null,
          postgres_user: null,
          postgres_password: null,
          postgres_dbname: null,
          postgres_table_name: null,
          collection_name: collectionName,
          embedding_model: embeddingModel,
          embedding_model_apikey: embeddingModelAPIKey,
          chunking_strategy: chunkingStrategy,
          max_segment_size: maxSegmentSize,
          max_overlap_size: maxOverlapSize,
        }),
      });

      if (!setupResponse.ok) {
        const errorText = await setupResponse.text();
        throw new Error(`${setupResponse.status} - ${errorText || 'Setup request failed'}`);
      } 

      const setupData = await setupResponse.json();

      const formData = new FormData();
      formData.append('request_id', requestId);
      formData.append('file', selectedFile);

      const response = await fetch(`${BACKEND_URL}/upload`, {
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
                            <MenuItem value="pinecone">Pinecone DB</MenuItem>
                            <MenuItem value="chroma">Chroma DB</MenuItem>
                            <MenuItem disabled value="postgres">PostgreSQL</MenuItem>
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
                        <MenuItem value="openai">OpenAI</MenuItem>
                        <MenuItem value="AZURE_openai">Azure OpenAI</MenuItem>
                        <MenuItem value="ANTHROPIC">Anthropic</MenuItem>
                        <MenuItem value="MISTRAL_AI">Mistral</MenuItem>
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
                Add data to vector store
                </Typography>
                {
                  isInputFile ?
                  <Box {...getRootProps()} className={`dropzone ${isDragActive || selectedFile ? 'active' : ''}`} border={1} borderRadius={2} mb={2} p={8} textAlign="center" minWidth="400px">
                  <input {...getInputProps()} />
                  <Typography variant="body1">
                  {!selectedFile ? isDragActive ? (
                      <p>Drop the files here ...</p>
                  ) : (
                      <p>Drag 'n' drop a file here, or <u>click here</u> to select file</p>
                  ) : ""}
                  {selectedFile && (
                      <p><b>Selected File:</b> {selectedFile.name}</p>
                  )}
                  </Typography>
                  </Box>
                  :
                  <Box mb={2}>
                    <FormControl fullWidth>
                      <TextField
                          placeholder="Add your text here"
                          value={inputText}
                          multiline
                          rows={7}
                          onChange={handleTextChange}
                        />
                    </FormControl>
                  </Box>
                }
                <Typography 
                  sx={{textAlign: "right", cursor: "pointer" }} 
                  onClick={handleInputTypeChange}
                >
                  <u>{isInputFile? "Or add plain text" : "Or upload file"} </u>
                </Typography>
                <Box my={2}>
                  <FormControl fullWidth >
                      <InputLabel id="chunking-stragtey-label">Chunking Strategy</InputLabel>
                      <Select
                      value={chunkingStrategy}
                      onChange={(e) => setChunkingStrategy(e.target.value)}
                      label="Chunking Strategy"
                      labelId="chunking-stragtey-label"
                      >
                          <MenuItem value="Recursive">Recursive (Default)</MenuItem>
                          <MenuItem value="BySentence">By Sentence</MenuItem>
                          <MenuItem value="ByParagraph">By Paragraph</MenuItem>
                      </Select>
                  </FormControl>
                </Box>
                <Box my={2}>
                  <FormControl fullWidth >
                      <TextField
                      value={maxSegmentSize}
                      type='number'
                      label="Max Segment Size"
                      onChange={(e) => setMaxSegmentSize(e.target.value)}
                      >
                      </TextField>
                  </FormControl>
                </Box>

                <Box my={2}>
                  <FormControl fullWidth >
                      <TextField
                      value={maxOverlapSize}
                      type='number'
                      label="Max Overlap Size"
                      onChange={(e) => setMaxOverlapSize(e.target.value)}
                      >
                      </TextField>
                  </FormControl>
                </Box>

                <Box mt={2}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{marginRight: "10px"}}
                    >
                    Upload
                    </Button>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {navigate("/query")}}
                    >
                    Retrieve from this store
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

export default UploadPage;
