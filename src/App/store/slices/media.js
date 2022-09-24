import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'media',
  initialState: null,
  reducers: {
    navigate: (state, action) => state,
    set: (state, action) => action.payload,
  },
});
