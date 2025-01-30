import React, { useState } from 'react';
import './App.css';

import SetupPage from './pages/SetupPage'
import Header from './common/Header';

function App() {
  return (
    <div>
      <Header/>
      <div className='container'>
        <SetupPage></SetupPage>
      </div>
    </div>
  );
}

export default App;
