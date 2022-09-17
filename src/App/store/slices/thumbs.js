import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'thumbs',
  initialState: {},
  reducers: {
    set: (state, action) => action.payload,
  },
});
