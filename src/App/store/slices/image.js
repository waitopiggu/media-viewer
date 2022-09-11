import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'image',
  initialState: {
    fit: 'none',
  },
  reducers: {
    merge: (state, action) => ({ ...state, ...action.payload }),
    set: (state, action) => action.payload,
  },
});
