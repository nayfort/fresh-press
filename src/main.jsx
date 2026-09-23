import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import PreferencesProvider from './context/PreferencesProvider.jsx';
import '@fontsource-variable/manrope';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </Router>
  </StrictMode>,
);
