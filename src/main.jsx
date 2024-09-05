import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { DarkThemeToggle, Flowbite } from 'flowbite-react';
import {FirebaseProvider} from './context/Firebase.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Flowbite>
      <div className="relative">
        <div className="absolute top-0 right-0 p-4 z-50">
          <DarkThemeToggle />
        </div>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
        
      </div>
    </Flowbite>
  </BrowserRouter>
);
