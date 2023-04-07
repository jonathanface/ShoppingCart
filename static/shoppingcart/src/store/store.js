import {configureStore} from '@reduxjs/toolkit';
import AddingOrEditingItemSlice from './AddingOrEditingItemSlice';
import ItemsSlice from './ItemsSlice';

export default configureStore({
  reducer: {
    isAddingOrEditingItem: AddingOrEditingItemSlice,
    items: ItemsSlice
  },
});