import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { registerServiceWorker } from './serviceWorkerRegistration';
import './index.css';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

