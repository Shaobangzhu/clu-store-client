import { useParams } from "react-router-dom";
import { product_list } from "@/assets/data/products";
import { useNavigate } from "react-router-dom";

type ParamsType = {
  id: string;
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<ParamsType>();
  const product = id
    ? product_list.find((item) => item.id === parseInt(id))
    : undefined;

  if (!product) {
    navigate("/404", { replace: true });
    return;
  }

  return (
    <div>
      <h1>Product Detail</h1>
      <p>This is the product detail page.</p>
      <p>{JSON.stringify(product)}</p>
    </div>
  );
};

export default ProductDetail;
