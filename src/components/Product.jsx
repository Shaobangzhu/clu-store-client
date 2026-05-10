import styles from "./Product.module.css";
import styled from "styled-components";

const StyledProductContainer = styled.div`
  max-width: 28rem;
  position: relative;
  transition: transform ${(props) => props.transition || "0.1s"} ease-in-out;

  &:hover {
    transform: scale(${(props) => props.scale || 1});
    cursor: pointer;
  }
`;

function Product({ image, title, detail, scale = 1.05, onProductClick }) {
  const imgStyle = {
    height: "auto",
    width: "100%",
    borderRadius: "0.5rem",
  };

  return (
    <StyledProductContainer
      scale={scale}
      transition="0.5s"
      onClick={() => onProductClick(title)}
    >
      <img style={imgStyle} src={image} alt="iPad Pro" />
      <div className={styles.productTextContainer}>
        <div className={styles.productTitle}>{title}</div>
        <div className={styles.productDetail}>{detail}</div>
      </div>
    </StyledProductContainer>
  );
}

export default Product;
