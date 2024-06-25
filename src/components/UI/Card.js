import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.photoContent}>{props.photo}</div>
      <div className={styles.cardContent}>{props.children}</div>
      <div className={styles.cardButton}>{props.buttons}</div>
    </div>
  );
};
export default Card;
