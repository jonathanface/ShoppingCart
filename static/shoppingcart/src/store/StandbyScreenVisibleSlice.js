import {createSlice} from '@reduxjs/toolkit';

export const standbyScreenVisibleSlice = createSlice({
  name: 'standbyScreenVisible',
  initialState: {
    value: true
  },
  reducers: {
    setStandbyScreenVisibleState: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const {setStandbyScreenVisibleState} = standbyScreenVisibleSlice.actions;

export default standbyScreenVisibleSlice.reducer;
