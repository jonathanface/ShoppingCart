import {createSlice} from '@reduxjs/toolkit';

export const addingOrEditingItemSlice = createSlice({
  name: 'isAddingOrEditingItem',
  initialState: {
    value: false
  },
  reducers: {
    flipAddingOrEditingItemState: (state) => {
      state.value = !state.value;
    }
  }
});

export const {flipAddingOrEditingItemState} = addingOrEditingItemSlice.actions;

export default addingOrEditingItemSlice.reducer;
