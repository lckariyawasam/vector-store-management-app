import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, TextField, Grid, Typography, Paper, Box, Select, MenuItem, FormControl, InputAdornment, IconButton, InputLabel } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function SetupPage() {
  const {
    selectedProvider, setSelectedProvider,
    vectorDBAPIKey, setVectorDBAPIKey,
    collectionName, setCollectionName,
    embeddingModel, setEmbeddingModel,
    embeddingModelAPIKey, setEmbeddingModelAPIKey,
    chromaURL, setChromaURL
  } = useContext(AppContext);

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [showRequiredIndicators, setShowRequiredIndicators] = useState(false);
  const [showDBApiKey, setShowDBApiKey] = useState(false);
  const [showEmbeddingModelApiKey, setShowEmbeddingModelApiKey] = useState(false);

  const initialState = useRef({
    selectedProvider,
    vectorDBAPIKey,
    collectionName,
    embeddingModel,
    embeddingModelAPIKey,
    chromaURL
  })

  const navigate = useNavigate();

  const resetValues = () => {
    setSelectedProvider(initialState.current.selectedProvider);
    setVectorDBAPIKey(initialState.current.vectorDBAPIKey);
    setCollectionName(initialState.current.collectionName);
    setEmbeddingModel(initialState.current.embeddingModel);
    setEmbeddingModelAPIKey(initialState.current.embeddingModelAPIKey);
  }

  useEffect(() => {
    const isVectorDBSettingsValid = selectedProvider && ((selectedProvider === "pinecone" && vectorDBAPIKey) || (selectedProvider === "chroma" && chromaURL)) && collectionName;
    const isEmbeddingSettingsValid = embeddingModel && embeddingModelAPIKey;
    setIsNextButtonDisabled(!(isVectorDBSettingsValid && isEmbeddingSettingsValid));
  }, [selectedProvider, vectorDBAPIKey, collectionName, embeddingModel, embeddingModelAPIKey, chromaURL]);


  useEffect(() => {
    setSelectedProvider(localStorage.getItem("selectedProvider"));
    setVectorDBAPIKey(localStorage.getItem("vectorDBAPIKey"));
    setCollectionName(localStorage.getItem("collectionName"));
    setEmbeddingModel(localStorage.getItem("embeddingModel"));
    setEmbeddingModelAPIKey(localStorage.getItem("embeddingModelAPIKey"));
    setChromaURL(localStorage.getItem("chromaURL"));
  }, [])

  const handleNext = () => {
    if (!isNextButtonDisabled) {
      localStorage.setItem("selectedProvider", selectedProvider)
      localStorage.setItem("vectorDBAPIKey", vectorDBAPIKey)
      localStorage.setItem("collectionName", collectionName)
      localStorage.setItem("embeddingModel", embeddingModel)
      localStorage.setItem("embeddingModelAPIKey", embeddingModelAPIKey)
      localStorage.setItem("chromaURL", chromaURL)
      navigate('/dashboard');
    } else {
      setShowRequiredIndicators(true);
    }
  };

  return (
    <Box m={4}>
        <Paper> 
            <Box p={10}>
                <Typography m={1} variant="h3" gutterBottom>
                    Initialize Vector Store
                </Typography>
                <Box mt={3} sx={{ display: "flex", flexDirection: "column", gap: "20px"}}>
                    <Grid xs={12}>
                        <FormControl fullWidth required error={showRequiredIndicators && !selectedProvider}>
                            <InputLabel id="selected-provider-label">Vector Database Provider</InputLabel>
                            <Select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            label="Vector Database Provider"
                            labelId="selected-provider-label"

                            >
                            <MenuItem value="pinecone">Pinecone DB</MenuItem>
                            <MenuItem value="chroma">Chroma DB</MenuItem>
                            <MenuItem disabled value="postgres">PostgreSQL</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {selectedProvider === "pinecone" && 
                    <Grid item xs={12}>
                    <TextField
                        label="Vector DB API Key"
                        value={vectorDBAPIKey}
                        onChange={(e) => setVectorDBAPIKey(e.target.value)}
                        fullWidth
                        required
                        type={ showDBApiKey ? 'text' : 'password'}
                        error={showRequiredIndicators && !vectorDBAPIKey}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {setShowDBApiKey(!showDBApiKey)}}
                                edge="end"
                              >
                                {showDBApiKey ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                    />
                    </Grid>
                    }
                    {selectedProvider==="chroma" &&
                    <Grid item xs={12}>
                    <TextField
                        label="Chroma Host URL"
                        value={chromaURL}
                        onChange={(e) => setChromaURL(e.target.value)}
                        fullWidth
                        required
                        error={showRequiredIndicators && !collectionName}
                    />
                    </Grid>
                    }
                    <Grid item xs={12}>
                    <TextField
                        label="Collection Name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        fullWidth
                        required
                        error={showRequiredIndicators && !collectionName}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl fullWidth required error={showRequiredIndicators && !embeddingModel}>
                        <InputLabel id="embedding-model-label">Embedding Model</InputLabel>
                        <Select
                        value={embeddingModel}
                        onChange={(e) => setEmbeddingModel(e.target.value)}
                        labelId='embedding-model-label'
                        label='Embedding Model'
                        >
                          <MenuItem value="openai">OpenAI</MenuItem>
                          <MenuItem disabled value="AZURE_openai">Azure OpenAI</MenuItem>
                          <MenuItem disabled value="ANTHROPIC">Anthropic</MenuItem>
                          <MenuItem disabled value="MISTRAL_AI">Mistral</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    {embeddingModel !== "SENTENCE_TRANSFORM" && (
                    <Grid item xs={12}>
                        <TextField
                        label="Embedding Model API Key"
                        value={embeddingModelAPIKey}
                        onChange={(e) => setEmbeddingModelAPIKey(e.target.value)}
                        fullWidth
                        required
                        error={showRequiredIndicators && !embeddingModelAPIKey}
                        type={ showEmbeddingModelApiKey ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {setShowEmbeddingModelApiKey(!showEmbeddingModelApiKey)}}
                                edge="end"
                              >
                                {showEmbeddingModelApiKey ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        />
                    </Grid>
                    )}
                    <Box mt={1}>
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={isNextButtonDisabled}
                        sx={{marginRight: "10px"}}
                        >
                        Next
                        </Button>
                        <Button
                        variant="contained"
                        color="secondary"
                        onClick={resetValues}
                        >
                        Reset
                      </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    </Box>
  );
}

export default SetupPage;
