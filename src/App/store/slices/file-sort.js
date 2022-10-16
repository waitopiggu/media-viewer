import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'file-sort',
  initialState: { desc: false, value: 'name' },
  reducers: {
    set: (state, action) => action.payload,
  },
});
