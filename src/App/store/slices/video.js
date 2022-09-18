import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'video',
  initialState: {
    autoplay: false,
    loop: false,
    muted: true,
    playbackRate: 1,
    volume: 0,
  },
  reducers: {
    merge: (state, action) => ({ ...state, ...action.payload }),
    set: (state, action) => action.payload,
  },
});
