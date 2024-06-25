import styles from '../room/Advant.module.css';


export default function Advant({ icon, count }) {
  return (
    <div className={styles.advant}>
      <div className={styles.iconBlock}>
        <img  src={icon} alt=''/>
        {count && <span className={styles.count}>{count}</span>}
      </div>
    </div>
  );
}