import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'directory-file',
  initialState: {},
  reducers: {
    merge: (state, action) => ({ ...state, ...action.payload }),
    navigate: (state, action) => state, // eslint-disable-line no-unused-vars
  },
});
