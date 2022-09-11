import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'files',
  initialState: [],
  reducers: {
    set: (state, action) => action.payload,
  },
});
