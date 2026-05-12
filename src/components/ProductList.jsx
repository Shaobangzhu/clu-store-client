// 主程序
import React from "react";
import NewArrival from "@components/NewArrival";

const ReleaseNote = () => (
  <div>
    <h1>新产品发布日期: 2199-01-01</h1>
    <h2>请耐心等待</h2>
  </div>
);

const ProductNotFound = () => (
  <div>
    <h1>产品未发布</h1>
    <h2>请耐心等待</h2>
  </div>
);

const ListTitle = ({ title }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <h1
      style={{
        fontWeight: "800",
        backgroundImage: "url('src/assets/lines.png')",
        backgroundPosition: "center",
      }}
    >
      {title || "新品上市"}
    </h1>
  </div>
);

function ProductList({ title, datalength, children }) {
  const isReleased = new Date() <= new Date("2199-01-01T00:00:00");
  if (!isReleased) {
    return <ReleaseNote />;
  }

  if (datalength <= 0) {
    return <ProductNotFound />;
  }
  return (
    <div
      style={{
        display: "grid",
        justifyItems: "center",
        rowGap: "3rem",
      }}
    >
      <ListTitle title={title} />
      {children}
    </div>
  );
}

export default ProductList;
