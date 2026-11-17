import { catalogService } from "@/api/services";
import { toProduct } from "@/api/adapters";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "../types/custom";

export const fetchSearchResults = createAsyncThunk<
  Product[],
  { keyword: string }
>("search", async ({ keyword }: { keyword: string }, { signal }) => {
  const { data } = await catalogService.products({ keyword }, { signal });
  return data.map(toProduct);
});

export interface SearchState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  items: [],
  isLoading: false,
  error: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        if (action.error.message === "Aborted") {
          // 终止请求, 不更新状态
          console.log("请求已取消");
          state.error = "请求已取消";
        } else {
          state.error = action.error.message || "请求失败";
        }
        state.isLoading = false;
        state.items = [];
      });
  },
});

export default searchSlice.reducer;
