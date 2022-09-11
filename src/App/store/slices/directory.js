import { createSlice } from '@reduxjs/toolkit';
import { homedir } from 'os';
import path from 'path';

const initialState = homedir().split(path.sep).join(path.posix.sep);

export default createSlice({
  name: 'directory',
  initialState,
  reducers: {
    set: (state, action) => action.payload,
  },
});
