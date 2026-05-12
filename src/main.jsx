// 主程序
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import { NEW_ARRIVALS_LIST_2 } from "@/assets/data"; // 导入产品数据
import ProductList from "@components/ProductList";

function App() {
  return (
    <div>
      <ProductList data={NEW_ARRIVALS_LIST_2} />
    </div>
  );
}

// JSX 是 JavaScript 的语法扩展，允许我们在 JavaScript 代码中编写类似 HTML 的代码.
// JSX = HTML语法 + JavaScript的能力
const root = document.getElementById("root"); // 获取id为root的DOM元素
const rootElement = ReactDOM.createRoot(root); // 创建一个 React 根元素
rootElement.render(
  <StrictMode>
    <App />
  </StrictMode>,
); // 将 App 组件渲染到根元素中
