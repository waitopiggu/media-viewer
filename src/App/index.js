import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Box, CssBaseline } from '@mui/material';
import store from './store';
import { AppBar, DevTools, Directory, Media } from './components';

/**
 * App Component
 */
const App = () => {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevTools />}
      <CssBaseline />
      <AppBar />
      <Box sx={{ display: 'flex' }}>
        <Directory />
        <Media />
      </Box>
    </>
  );
};

const container = document.getElementById('app-root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>
);
