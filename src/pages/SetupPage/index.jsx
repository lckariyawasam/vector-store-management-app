import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function SetupPage() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [vectorDBAPIKey, setVectorDBAPIKey] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [embeddingModel, setEmbeddingModel] = useState("");
  const [embeddingModelAPIKey, setEmbeddingModelAPIKey] = useState("");
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [showRequiredIndicators, setShowRequiredIndicators] = useState(false); // New state

  const navigate = useNavigate();

  useEffect(() => {
    const isVectorDBSettingsValid = selectedProvider && vectorDBAPIKey && collectionName;
    const isEmbeddingSettingsValid = embeddingModel && (embeddingModel === "SENTENCE_TRANSFORM" || embeddingModelAPIKey);

    setIsNextButtonDisabled(!(isVectorDBSettingsValid && isEmbeddingSettingsValid));
  }, [selectedProvider, vectorDBAPIKey, collectionName, embeddingModel, embeddingModelAPIKey]);

  const handleNext = () => {
    if (isNextButtonDisabled) {
      setShowRequiredIndicators(true); // Show indicators if button is clicked and disabled
    } else {
      setShowRequiredIndicators(false); // Hide indicators before navigation
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
        <div className={`input-section ${getRequiredIndicatorClass(!selectedProvider)}`}> {/* Added class */}
          <label htmlFor="collection-name">Database Provider</label>
          <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
            <option value="" disabled>Select a provider</option>
            <option value="PINECONE">Pinecone DB</option>
            <option value="CHROMA">Chroma DB</option>
            <option value="WEVIATE">Weviate</option>
          </select>
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(!vectorDBAPIKey)}`}> {/* Added class */}
          <label htmlFor="collection-name">VectorDB API Key</label> {/* Added Label */}
          <input
            type="text"
            placeholder="VectorDB API Key"
            value={vectorDBAPIKey}
            onChange={(e) => setVectorDBAPIKey(e.target.value)}
          />
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(!collectionName)}`}> {/* Added class */}
          <label htmlFor="collection-name">Collection Name</label>
          <input
            id='collection-name'
            type="text"
            placeholder="Input Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(!embeddingModel)}`}> {/* Added class */}
          <label htmlFor="collection-name">Embedding Model</label>
          <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}>
            <option value="" disabled>Select a provider</option>
            <option value="OPEN_AI">OpenAI</option>
            <option value="AZURE_OPEN_AI">Azure OpenAI</option>
            <option value="MISTRAL">Mistral</option>
            <option value="SENTENCE_TRANSFORM">Sentence Transformers</option>
          </select>
        </div>
        <div className={`input-section ${getRequiredIndicatorClass(embeddingModel !== "SENTENCE_TRANSFORM" && !embeddingModelAPIKey)}`}> {/* Added class and complex condition */}
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
