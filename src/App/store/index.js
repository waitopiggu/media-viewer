import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { DevTools } from '../components';
import listeners from './listeners';
import slices from './slices';

export const actions = {
  directory: slices.directory.actions,
  files: slices.files.actions,
  image: slices.image.actions,
  media: slices.media.actions,
  thumbs: slices.thumbs.actions,
  video: slices.video.actions,
};

const listenerMiddleware = createListenerMiddleware();

listeners.forEach((listenerOptions) => {
  listenerMiddleware.startListening(listenerOptions);
});

const reducers = combineReducers({
  directory: slices.directory.reducer,
  files: slices.files.reducer,
  image: slices.image.reducer,
  media: slices.media.reducer,
  thumbs: slices.thumbs.reducer,
  video: slices.video.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [slices.files.name, slices.thumbs.name],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  middleware: [listenerMiddleware.middleware],
  reducer: persistedReducer,
  enhancers: [DevTools.instrument()],
});
