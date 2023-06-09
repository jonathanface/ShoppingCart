import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
export const getItems = createAsyncThunk('api/items', async () => {
  const response = await fetch('api/items').then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.status);
  }).then((data) => {
    return data;
  }).catch((error) => {
    console.error(error);
  });
  return response;
});

export const ItemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: null,
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getItems.pending, (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    });
    builder.addCase(getItems.fulfilled, (state, action) => {
      if (state.loading === 'pending') {
        state.items = action.payload;
        state.loading = 'idle';
      }
    });
    builder.addCase(getItems.rejected, (state, action) => {
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.error = 'Error occured';
      }
    });
  },
});
export default ItemsSlice.reducer;
