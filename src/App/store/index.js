import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { DevTools } from '../components';
import listeners from './listeners';
import slices from './slices';

const listenerMiddleware = createListenerMiddleware();

listeners.forEach((listenerOptions) => {
  listenerMiddleware.startListening(listenerOptions);
});

const reducers = combineReducers({
  app: slices.app.reducer,
  directory: slices.directory.reducer,
  directoryFile: slices.directoryFile.reducer,
  files: slices.files.reducer,
  fileSort: slices.fileSort.reducer,
  image: slices.image.reducer,
  video: slices.video.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [slices.files.name],
};

export default configureStore({
  middleware: [listenerMiddleware.middleware],
  reducer: persistReducer(persistConfig, reducers),
  enhancers: __DEV__ ? [DevTools.instrument()] : [],
});
