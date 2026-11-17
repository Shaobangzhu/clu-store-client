import { catalogService } from '@/api/services';
import { toProduct } from '@/api/adapters';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '../types/custom';
import type { components, operations } from '../api/schema';

export type CatalogQuery = NonNullable<operations['products']['parameters']['query']>;
export type PageMeta = components['schemas']['productsResponse200']['meta'];
export const fetchSearchResults = createAsyncThunk(
  'search/products', async (query: CatalogQuery, { signal }) => {
    const { data, meta } = await catalogService.products(query, { signal });
    return { items: data.map(toProduct), meta };
  },
);
export interface SearchState {
  items: Product[];
  meta: PageMeta | null;
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
}
const initialState: SearchState = { items: [], meta: null, isLoading: false, error: null, requestId: null };
export const searchSlice = createSlice({
  name: 'search', initialState, reducers: {},
  extraReducers: builder => builder
    .addCase(fetchSearchResults.pending, (state, action) => {
      state.requestId = action.meta.requestId;
      state.isLoading = true;
      state.error = null;
      state.items = [];
      state.meta = null;
    })
    .addCase(fetchSearchResults.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false;
      state.items = action.payload.items;
      state.meta = action.payload.meta;
      state.requestId = null;
    })
    .addCase(fetchSearchResults.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false;
      state.items = [];
      state.meta = null;
      state.requestId = null;
      state.error = action.meta.aborted ? null : action.error.message || 'Request failed';
    }),
});
export default searchSlice.reducer;
