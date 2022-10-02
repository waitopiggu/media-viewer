import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'directory-file',
  initialState: {},
  reducers: {
    clean: (state) => state,
    merge: (state, action) => ({ ...state, ...action.payload }),
    navigate: (state, action) => state,
    set: (state, action) => action.payload,
  },
});
