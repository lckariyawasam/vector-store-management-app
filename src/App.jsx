import React, { useState } from 'react';
import './App.css';

import SetupPage from './pages/SetupPage'
import Dashboard from './pages/Dashboard';
import Header from './common/Header';
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <div>
      <Header/>
      <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SetupPage />} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
