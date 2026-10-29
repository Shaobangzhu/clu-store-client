import { createStore } from "redux";
import i18nReducer from "./i18nReducer";

const store = createStore(i18nReducer);

export type RootState = ReturnType<typeof store.getState>;
export default store;
