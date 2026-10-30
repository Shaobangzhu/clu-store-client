import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type Product } from "../types/custom";

export const fetchSearchResults = createAsyncThunk<
  Product[],
  { keyword: string }
>("search", async ({ keyword }: { keyword: string }, { signal }) => {
  const controller = new AbortController();
  signal.addEventListener("abort", () => {
    controller.abort();
  });

  const response = await fetch(
    `http://152.136.182.210:12231/api/products?keyword=${encodeURIComponent(keyword)}`,
    { signal: controller.signal },
  );
  if (response.status == 404) {
    throw new Error("没有找到商品"); // 抛出的错误会自动进入RTK的reject分支
  }
  if (!response.ok) {
    throw new Error("请求失败"); // 抛出的错误会自动进入RTK的reject分支
  }
  const data: Product[] = await response.json();
  return data; // 返回的数据会自动进入RTK的fulfilled分支
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
