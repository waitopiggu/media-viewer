import { createSlice } from '@reduxjs/toolkit';
import { homedir } from 'os';
import { getPosixPath } from '../../shared/util';

export default createSlice({
  name: 'directory',
  initialState: getPosixPath(homedir()),
  reducers: {
    set: (state, action) => action.payload,
  },
});
