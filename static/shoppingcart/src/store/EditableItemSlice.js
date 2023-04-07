import {createSlice} from '@reduxjs/toolkit';

export const EditableItemSlice = createSlice({
  name: 'editableItem',
  initialState: {
    editingID: null,
    editingQty: 1,
    editingName: "",
    editingDescr: "",
    editingPurchased: false,
    inEditMode: false
  },
  reducers: {
    setEditableItem: (state, action) => {
      state.editingID = action.payload.id;
      state.editingQty = action.payload.quantity;
      state.editingName = action.payload.name;
      state.editingDescr = action.payload.description;
      state.editingPurchased = action.payload.purchased;
    },
    setInEditMode: (state, action) => {
      state.inEditMode = action.payload;
    },
    resetEditableItem: (state) => {
      state.editingID = null;
      state.editingQty = 1;
      state.editingName = "";
      state.editingDescr = "";
      state.editingPurchased = false;
    }
  }
});

export const {setInEditMode, setEditableItem, resetEditableItem} = EditableItemSlice.actions;

export default EditableItemSlice.reducer;
