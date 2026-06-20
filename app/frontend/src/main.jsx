import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { OrganizerAuthProvider } from './context/OrganizerAuthContext.jsx';
import { DayofAuthProvider } from './context/DayofAuthContext.jsx';
import { VenueOwnerAuthProvider } from './context/VenueOwnerAuthContext.jsx';
import { GuestAuthProvider } from './context/GuestAuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrganizerAuthProvider>
        <DayofAuthProvider>
          <VenueOwnerAuthProvider>
            <GuestAuthProvider>
              <App />
            </GuestAuthProvider>
          </VenueOwnerAuthProvider>
        </DayofAuthProvider>
      </OrganizerAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
