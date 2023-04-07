import {createSlice} from '@reduxjs/toolkit';

export const DeletingItemStateSlice = createSlice({
  name: 'isDeletingItem',
  initialState: {
    value: false
  },
  reducers: {
    setDeletingItemState: (state, action) => {
      state.value = action.payload;
    },
  }
});

export const {setDeletingItemState} = DeletingItemStateSlice.actions;

export default DeletingItemStateSlice.reducer;
