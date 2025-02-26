import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [vectorDBAPIKey, setVectorDBAPIKey] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [embeddingModel, setEmbeddingModel] = useState("");
  const [embeddingModelAPIKey, setEmbeddingModelAPIKey] = useState("");
  const [chromaURL, setChromaURL] = useState("");

  return (
    <AppContext.Provider value={{
      selectedProvider,
      setSelectedProvider,
      vectorDBAPIKey,
      setVectorDBAPIKey,
      collectionName,
      setCollectionName,
      embeddingModel,
      setEmbeddingModel,
      embeddingModelAPIKey,
      setEmbeddingModelAPIKey,
      chromaURL,
      setChromaURL
    }}>
      {children}
    </AppContext.Provider>
  );
};
