import {configureStore} from '@reduxjs/toolkit';
import AddingItemSlice from './AddingItemSlice';
import ItemsSlice from './ItemsSlice';

export default configureStore({
  reducer: {
    isAddingItem: AddingItemSlice,
    items: ItemsSlice
  },
});