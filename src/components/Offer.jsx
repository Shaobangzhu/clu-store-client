// Sample offer data:
// {
//     type: "限时折扣",
//     title: "春季大促销",
//     details: "全场满100减20",
//     image: "https://example.com/spring-sale.jpg",
// }
import styles from "./Offer.module.css";

function Offer({ type, title, detail, image }) {
  return (
    <div className={styles.container}>
      <img src={image} className={styles.image} />
      <div className={styles.content}>
        <div className={styles.type}>{type}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.detail}>{detail}</div>
      </div>
    </div>
  );
}

export default Offer;
