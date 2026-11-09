import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import './styles/booking.css';
import './styles/map.css';
import './styles/legacy-vars.css';
// Tema 2026: tokenuri și layout peste index.css, înaintea corecturilor.
import './styles/theme-2026.css';
// Ultimul: corecturile mobile și de accesibilitate trebuie să câștige cascada.
import './styles/mobile-fixes.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
