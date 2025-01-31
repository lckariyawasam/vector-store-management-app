import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from './context/AppContext';
import SetupPage from './pages/SetupPage';
import Dashboard from './pages/Dashboard';
import Header from './common/Header';

function App() {
  return (
    <AppProvider>
      <Header />
      <div className='container'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SetupPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App;
