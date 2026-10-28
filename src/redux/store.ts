import { createStore } from "redux";
import i18nReducer, { setCulture } from "./i18nReducer";

const store = createStore(i18nReducer);
export default store;

// console.log("Redux store initialized:", store.getState());

// // 切换繁体中文
// store.dispatch(setCulture("zh-TW"));
// console.log("Updated Redux store state:", store.getState());

// // 切换英文
// store.dispatch(setCulture("en-US"));
// console.log("Updated Redux store state:", store.getState());

// // 切换法语
// store.dispatch(setCulture("fr-FR"));
// console.log("Updated Redux store state:", store.getState());

// // 切换回简体中文
// store.dispatch(setCulture("zh-CN"));
// console.log("Updated Redux store state:", store.getState());
