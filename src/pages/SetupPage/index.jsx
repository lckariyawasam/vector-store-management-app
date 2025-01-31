import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
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

  const navigate = useNavigate();

  useEffect(() => {
    const isVectorDBSettingsValid = selectedProvider && vectorDBAPIKey && collectionName;
    const isEmbeddingSettingsValid = embeddingModel && (embeddingModel === "SENTENCE_TRANSFORM" || embeddingModelAPIKey);

    setIsNextButtonDisabled(!(isVectorDBSettingsValid && isEmbeddingSettingsValid));
  }, [selectedProvider, vectorDBAPIKey, collectionName, embeddingModel, embeddingModelAPIKey]);

  const handleNext = () => {
    if (isNextButtonDisabled) {
      setShowRequiredIndicators(true);
    } else {
      setShowRequiredIndicators(false);
      navigate("/dashboard");
    }
  };

  const getRequiredIndicatorClass = (isValid) => {
    return showRequiredIndicators && !isValid ? 'required-indicator' : '';
  };

  return (
    <div className="vector-db-configs setup-form">
      <div className="vector-db-provider">
        <h2>Setup Vector Store</h2>
        <div className={`input-section ${getRequiredIndicatorClass(!selectedProvider)}`}>
          <label htmlFor="collection-name">Database Provider</label>
          <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
            <option value="" disabled>Select a provider</option>
            <option value="PINECONE">Pinecone DB</option>
            <option value="CHROMA">Chroma DB</option>
            <option value="WEVIATE">Weviate</option>
          </select>
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(!vectorDBAPIKey)}`}>
          <label htmlFor="collection-name">VectorDB API Key</label>
          <input
            type="text"
            placeholder="VectorDB API Key"
            value={vectorDBAPIKey}
            onChange={(e) => setVectorDBAPIKey(e.target.value)}
          />
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(!collectionName)}`}>
          <label htmlFor="collection-name">Collection Name</label>
          <input
            id='collection-name'
            type="text"
            placeholder="Input Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(!embeddingModel)}`}>
          <label htmlFor="collection-name">Embedding Model</label>
          <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}>
            <option value="" disabled>Select a provider</option>
            <option value="OPEN_AI">OpenAI</option>
            <option value="AZURE_OPEN_AI">Azure OpenAI</option>
            <option value="MISTRAL">Mistral</option>
            <option value="SENTENCE_TRANSFORM">Sentence Transformers</option>
          </select>
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(embeddingModel !== "SENTENCE_TRANSFORM" && !embeddingModelAPIKey)}`}>
          <label htmlFor="embedding-api-key">Embedding Model API Key</label>
          <input
            id="embedding-api-key"
            type="text"
            placeholder="Embedding Model API Key"
            value={embeddingModelAPIKey}
            onChange={(e) => setEmbeddingModelAPIKey(e.target.value)}
            disabled={embeddingModel === "SENTENCE_TRANSFORM"}
          />
        </div>
        <button onClick={handleNext} className='setup-form-button' disabled={isNextButtonDisabled}>
          Next
        </button>
      </div>
    </div>
  );
}

export default SetupPage;
