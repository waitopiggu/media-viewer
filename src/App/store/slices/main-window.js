import { createSlice } from '@reduxjs/toolkit';
import { getCurrentWindow } from '@electron/remote';

export default createSlice({
  name: 'main-window',
  initialState: {
    bounds: getCurrentWindow().getBounds(),
  },
  reducers: {
    merge: (state, action) => ({ ...state, ...action.payload }),
  },
});
