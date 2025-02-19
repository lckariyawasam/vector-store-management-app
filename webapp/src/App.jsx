import React, { useState, useMemo} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from './context/AppContext';
import UploadPage from './pages/UploadPage';
import SetupPage from './pages/SetupPage'
import QueryPage from './pages/Query';
import Header from './common/Header';

import { themeSettings } from "./theme";

// MUI imports
import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  const processLocalThemeMode = () => {
    var localMode = localStorage.getItem(
      "internal-app-theme"
    );

    if (localMode) {
      return localMode;
    } else {
      localStorage.setItem("internal-app-theme", "dark");
      return "light";
    }
  };

  const [mode, setMode] = useState(processLocalThemeMode());

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        localStorage.setItem(
          "internal-app-theme",
          mode === "light" ? "dark" : "light"
        );
        setMode((prevMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    [mode]
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);


  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <Header theme={theme} setTheme={colorMode}/>
        <div className='container' style={{
          backgroundColor: mode === "light" ? "white" : "#202020"
        }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<SetupPage />}/>
              <Route path='/dashboard' element={<UploadPage />} />
              <Route path='/query' element={<QueryPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
