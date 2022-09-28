import React from 'react';
import { debounce } from 'lodash';
import { Provider, useDispatch, useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { getCurrentWindow } from '@electron/remote';
import { createRoot } from 'react-dom/client';
import { Box, CssBaseline } from '@mui/material';
import { appBarHeight } from './shared/var';
import actions from './store/actions';
import store from './store';
import { AppBar, DevTools, Directory, Media } from './components';

const DELAY_MS = 300;

/**
 * App Component
 */
function App() {
  const dispatch = useDispatch();
  const rxStore = useStore();

  const onWindowChange = debounce(() => {
    const currentWindow = getCurrentWindow();
    const bounds = currentWindow.getBounds();
    dispatch(actions.app.merge({ bounds }));
  }, DELAY_MS);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';

    const currentWindow = getCurrentWindow();
    currentWindow.on('move', onWindowChange);
    window.addEventListener('resize', onWindowChange);

    const { app } = rxStore.getState();
    currentWindow.setBounds(app.windowBounds);
    currentWindow.show();
  }, []);

  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevTools />}
      <CssBaseline />
      <AppBar />
      <Box sx={{ height: appBarHeight }} />
      <Box sx={{ display: 'flex' }}>
        <Directory />
        <Media />
      </Box>
    </>
  );
}

const container = document.getElementById('app-root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>,
);
