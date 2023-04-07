import {configureStore} from '@reduxjs/toolkit';
import AddingOrEditingItemSlice from './AddingOrEditingItemSlice';
import ItemsSlice from './ItemsSlice';
import StandbyScreenVisibleSlice from './StandbyScreenVisibleSlice';
import EditableItemSlice from './EditableItemSlice';
import DeletingItemStateSlice from './DeletingItemStateSlice';

export default configureStore({
  reducer: {
    isAddingOrEditingItem: AddingOrEditingItemSlice,
    items: ItemsSlice,
    standbyScreenVisible: StandbyScreenVisibleSlice,
    editableItem: EditableItemSlice,
    isDeletingItem: DeletingItemStateSlice
  },
});
