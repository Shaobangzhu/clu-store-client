// 主程序
import React from "react";
import Product from "@components/Product";

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

const ListTitle = () => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <h1
      style={{
        fontWeight: "800",
        backgroundImage: "url('src/assets/lines.png')",
        backgroundPosition: "center",
      }}
    >
      上新品，各个添新意
    </h1>
  </div>
);

function ProductList({ data }) {
  const isReleased = new Date() <= new Date("2199-01-01T00:00:00");
  if (!isReleased) {
    return <ReleaseNote />;
  }

  if (data.length <= 0) {
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
      <ListTitle />
      {data.map((p) => (
        <Product {...p} key={p.title} />
      ))}
    </div>
  );
}

export default ProductList;
