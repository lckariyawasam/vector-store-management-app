import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, TextField, Grid, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function SetupPage() {
  const {
    selectedProvider, setSelectedProvider,
    vectorDBAPIKey, setVectorDBAPIKey,
    collectionName, setCollectionName,
    embeddingModel, setEmbeddingModel,
    embeddingModelAPIKey, setEmbeddingModelAPIKey
  } = useContext(AppContext);

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [showRequiredIndicators, setShowRequiredIndicators] = useState(false);

  const initialState = useRef({
    selectedProvider,
    vectorDBAPIKey,
    collectionName,
    embeddingModel,
    embeddingModelAPIKey
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
    const isVectorDBSettingsValid = selectedProvider && vectorDBAPIKey && collectionName;
    const isEmbeddingSettingsValid = embeddingModel && (embeddingModel === "SENTENCE_TRANSFORM" || embeddingModelAPIKey);
    setIsNextButtonDisabled(!(isVectorDBSettingsValid && isEmbeddingSettingsValid));
  }, [selectedProvider, vectorDBAPIKey, collectionName, embeddingModel, embeddingModelAPIKey]);

  const handleNext = () => {
    if (!isNextButtonDisabled) {
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
                            <MenuItem value="PineconeDB">Pinecone DB</MenuItem>
                            <MenuItem value="ChromaDB">Chroma</MenuItem>
                            <MenuItem value="Weviate">Weviate</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        label="Vector DB API Key"
                        value={vectorDBAPIKey}
                        onChange={(e) => setVectorDBAPIKey(e.target.value)}
                        fullWidth
                        required
                        error={showRequiredIndicators && !vectorDBAPIKey}
                    />
                    </Grid>
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
                        <MenuItem value="OPENAI">OpenAI</MenuItem>
                        <MenuItem value="MODEL2">Azure OpenAI</MenuItem>
                        <MenuItem value="SENTENCE_TRANSFORM">Sentence Transform</MenuItem>
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
