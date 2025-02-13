import React, { useState, useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Button, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = "http://localhost:8290/retrieve";

function QueryPage() {
  const {
    selectedProvider,
    vectorDBAPIKey,
    collectionName,
    embeddingModel,
    embeddingModelAPIKey
  } = useContext(AppContext);

  const [retrieving, setRetrieve] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [userQuery, setUserQuery] = useState("");
  const [returnedText, setReturnedText] = useState([])

  const navigate = useNavigate();

  //Return to setup screen if details are missing
  useEffect(() => {
    if (selectedProvider === "" || embeddingModel === "" || collectionName === "") {
      navigate("/")
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    setRetrieve('retrieving');
    setUploadMessage('');

    setReturnedText([]);

    const formData = new FormData();
    formData.append('selectedProvider', selectedProvider);
    formData.append('vectorDBAPIKey', vectorDBAPIKey);
    formData.append('collectionName', collectionName);
    formData.append('embeddingModel', embeddingModel);
    formData.append('embeddingModelAPIKey', embeddingModelAPIKey);
    formData.append('query', userQuery);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} - ${errorText || 'File upload failed'}`);
      }

      const data = await response.json();
      setReturnedText(data)
      setRetrieve(false);
      setUploadMessage("");
      console.log('Retrieved text!:', data);

    } catch (error) {
      console.error('Error uploading file:', error);
      setRetrieve(false);
      setUploadMessage(`Retrieving failed. Error: ${error.message}`);
    }
  };

  return (
    <>
    <Box mt={5} sx={{ display: "block", width: '100%', maxWidth: '800px', overflow: 'auto' }}>
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
                <Typography m={1} variant="p" gutterBottom>
                    Get the most similar entries from the vector store
                </Typography>
                <Box my={2}>
                  <FormControl fullWidth >
                      <TextField
                      value={userQuery}
                      label="Query"
                      onChange={(e) => setUserQuery(e.target.value)}
                      >
                      </TextField>
                  </FormControl>
                </Box>

                <Box mt={2}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={retrieving}
                    sx={{marginRight: "10px"}}
                    >
                    {retrieving ?  "Retrieving" : "Retrieve"}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {navigate("/dashboard")}}
                    >Add to store</Button>
                </Box>
                <Box>
                {returnedText.length > 0 &&
                <Box mt={5}> 
                  <Typography my={1} variant="h3" gutterBottom>
                      Most similar entries from the vector store
                  </Typography>
                </Box>
                }
                <ul>
                  {
                    returnedText.map((emb, index) => (
                          <li key={index}>{emb.embedded.text}</li>
                    ))
                  }
                </ul>
                </Box>
            </Box>
        </Paper>
    </Box>
    </>

  );
}

export default QueryPage;
