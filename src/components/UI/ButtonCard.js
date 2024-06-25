import styles from "./Button.module.css";
import { motion } from "framer-motion";
const ButtonCard = (props) => {
  return props.type === "favorite" ? (
    <motion.button
  initial={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
  style={{
    border: "none",
    padding: "5px",
    cursor: "pointer",
    borderRadius: "32px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
  }}
  whileHover={{ scale: 1.05 }} // Mild scale on hover
  whileTap={{ scale: 1.2, backgroundColor: "rgba(255, 0, 0, 1)", rotateX: "45deg" }} // 3D effect on tap
  transition={{ type: "spring", stiffness: 300,duration: 2.0  }} // Spring effect for smoother animation
  onClick={props.onClick}
  type={props.type}
  disabled={props.disabled}
>
  <img
    src="https://img.icons8.com/external-vectorslab-glyph-vectorslab/48/FFFFFF/external-Stars-shopping-and-commerce-vectorslab-glyph-vectorslab.png"
    alt="external-Stars-shopping-and-commerce-vectorslab-glyph-vectorslab"
  />
</motion.button>
  ) : (
    <button
      className={styles.prevButton}
      onClick={props.onClick}
      type={props.type || "button"}
      disabled={props.disabled}
    >
      <img  
        src="https://img.icons8.com/external-vectorslab-glyph-vectorslab/48/FFFFFF/external-Negative-Feedback-social-media-vectorslab-glyph-vectorslab.png"
        alt="external-Negative-Feedback-social-media-vectorslab-glyph-vectorslab"
      />
    </button>
  );
};

export default ButtonCard;

// style={{marginLeft:' 85px' }}
