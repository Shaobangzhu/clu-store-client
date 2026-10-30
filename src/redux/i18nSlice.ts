import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type CultureCode } from "./i18nReducer";

export interface I18nState {
  currentLanguage: CultureCode;
}

const initialState: I18nState = {
  currentLanguage: "zh-CN",
};

export const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    setCulture(state, action: PayloadAction<CultureCode>) {
      // 注意这里, 我们直接改state, 看起来像可变，
      // 其实底层用 immer 保证不可变
      state.currentLanguage = action.payload;
    },
  },
});

export const { setCulture } = i18nSlice.actions;
export default i18nSlice.reducer;
