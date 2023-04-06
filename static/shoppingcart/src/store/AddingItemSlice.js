import {createSlice} from '@reduxjs/toolkit';

export const AddingItemSlice = createSlice({
  name: 'isAddingItem',
  initialState: {
    value: false
  },
  reducers: {
    flipAddingItemState: (state) => {
      state.value = !state.value;
    }
  }
});

export const {flipAddingItemState} = AddingItemSlice.actions;

export default AddingItemSlice.reducer;