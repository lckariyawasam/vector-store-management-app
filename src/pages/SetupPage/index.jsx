import React, { useState } from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom'

function SetupPage() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [vectorDBAPIKey, setVectorDBAPIKey] = useState("");
  const [collectionName, setCollectionName] = useState("")
  const [embeddingModel, setEmbeddingModel] = useState("")
  const [embeddingModelAPIKey, setEmbeddingModelAPIKey] = useState("")

  const navigate = useNavigate()

  return (
    <div className="vector-db-configs setup-form">
      <div className="vector-db-provider">
        <h2>Setup Vector Store</h2>
        <div className='input-section'>
          <label htmlFor="collection-name">Database Provider</label>
          <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)}>
            <option value="" disabled>Select a provider</option>
            <option value="PINECONE">Pinecone DB</option>
            <option value="CHROMA">Chroma DB</option>
            <option value="WEVIATE">Weviate</option>
          </select>
          <div>
            <input
              type="text"
              placeholder="VectorDB API Key"
              value={vectorDBAPIKey}
              onChange={(e) => setVectorDBAPIKey(e.target.value)}
            />
          </div>
        </div>
        <div className='input-section'>
          <label htmlFor="collection-name">Collection Name</label>
          <input id='collection-name'
            type="text"
            placeholder="Input Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className='input-section'>
          <label htmlFor="collection-name">Embedding Model</label>
          <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}>
            <option value="" disabled>Select a provider</option>
            <option value="OPEN_AI">OpenAI</option>
            <option value="AZURE_OPEN_AI">Azure OpenAI</option>
            <option value="MISTRAL">Mistral</option>
            <option value="SENTENCE_TRANSFORM">Sentence Transformers</option>
          </select>
          <div>
            <input
              type="text"
              placeholder="Embedding Model API Key"
              value={embeddingModelAPIKey}
              onChange={(e) => setEmbeddingModelAPIKey(e.target.value)}
            />
          </div>
        </div>
        <button onClick={() => navigate("/dashboard")} className='setup-form-button'>Next</button>
      </div>
    </div>
  );
}

export default SetupPage;
