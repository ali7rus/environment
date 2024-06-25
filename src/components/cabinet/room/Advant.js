import styles from './Advant.module.css';


export default function Advant({ icon, count }) {
  return (
    <div className={styles.advant}>
      <div className={styles.iconBlock}>
        <img  src={icon} alt=''/>
      </div>
    </div>
  );
}