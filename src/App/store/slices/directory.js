import { createSlice } from '@reduxjs/toolkit';
import { homedir } from 'os';

export default createSlice({
  name: 'directory',
  initialState: homedir(),
  reducers: {
    set: (state, action) => action.payload,
  },
});
