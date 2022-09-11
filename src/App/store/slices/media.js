import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'media',
  initialState: null,
  reducers: {
    set: (state, action) => action.payload,
  },
});
