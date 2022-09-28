import { createSlice } from '@reduxjs/toolkit';
import { getCurrentWindow } from '@electron/remote';

export default createSlice({
  name: 'app',
  initialState: {
    windowBounds: getCurrentWindow().getBounds(),
  },
  reducers: {
    merge: (state, action) => ({ ...state, ...action.payload }),
  },
});
