import styles from "./Offer.module.css";
import ProductImage from './ProductImage';

export interface OfferProps {
  type: string;
  title: string;
  detail: string;
  image: string;
}

function Offer({ type, title, detail, image }: OfferProps) {
  return (
    <div className={styles.container}>
      <ProductImage src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <div className={styles.type}>{type}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.detail}>{detail}</div>
      </div>
    </div>
  );
}

export default Offer;
