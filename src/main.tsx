// 主程序
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css"; // 引入 CSS 文件
import App from "./App"; // 引入 App 组件
import store from "./redux/store";
import { Provider } from "react-redux"; // 引入 react-redux 的 Provider组件
import "./i18n/config"; // 引入 i18n 配置文件, i18n的配置会自动执行

// JSX 是 JavaScript 的语法扩展，允许我们在 JavaScript 代码中编写类似 HTML 的代码.
// JSX = HTML语法 + JavaScript的能力
const root = document.getElementById("root")!; // 获取id为root的DOM元素
const rootElement = ReactDOM.createRoot(root); // 创建一个 React 根元素
rootElement.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
); // 将 App 组件渲染到根元素中
