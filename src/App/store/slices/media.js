import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'media',
  initialState: null,
  reducers: {
    navigate: (state, action) => state, // eslint-disable-line no-unused-vars
    set: (state, action) => action.payload,
  },
});
