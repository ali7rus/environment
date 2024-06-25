import styles from "./Button.module.css";
import iconGo from "./images/iconGo.png";
import iconBack from "./images/iconBack.png";
import iconPlus from "./images/iconPlus.png";
import iconReset from "./images/iconReset.png";
const Button = (props) => {
  return (
    <>
      {props.type === "submit" && (
        <button
          className={styles.nextButton}
          onClick={props.onClick}
          type={props.type}
          disabled={props.disabled}
        >
          <img src={iconGo} alt="circled-right" />
        </button>
      )}
      {props.type === "button" &&
     ( <button
        className={styles.prevButton}
        onClick={props.onClick}
        type={props.type || "button"}
        disabled={props.disabled}
      >
        <img src={iconBack} alt="circled-left" />
      </button>)
      }
      {props.type === "reset" &&
     ( <button
        className={styles.prevButton}
        onClick={props.onClick}
        type={props.type || "button"}
        disabled={props.disabled}
      >
        <img src={iconReset} alt="circled-centr" />
      </button>)
      }
      {props.type === "button1" &&
     ( <button
        className={styles.prevButton}
        onClick={props.onClick}
        type={props.type || "button"}
        disabled={props.disabled}
      >
        <img src={iconPlus} alt="circled-centr1" />
      </button>)
      }
    </>
  );
};

export default Button;
