import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'image',
  initialState: {
    fit: 'none',
    pixelated: false,
  },
  reducers: {
    merge: (state, action) => ({ ...state, ...action.payload }),
    set: (state, action) => action.payload,
  },
});
