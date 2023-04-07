import {createSlice} from '@reduxjs/toolkit';

export const addingOrEditingItemSlice = createSlice({
  name: 'isAddingOrEditingItem',
  initialState: {
    value: false
  },
  reducers: {
    setAddingOrEditingItemState: (state, action) => {
      state.value = action.payload;
    },
  }
});

export const {setAddingOrEditingItemState} = addingOrEditingItemSlice.actions;

export default addingOrEditingItemSlice.reducer;
