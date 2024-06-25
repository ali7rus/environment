import styles from "./Modal.module.css";
const Modal = (props) => {
  const { isOpen, onClose, file } = props;

  if (!isOpen) {
    return null;
  }

  const fileUrl = file ? URL.createObjectURL(file) : "";
  const saveHandle = () => {
    onClose(true);
  };
  const closeModal = () => {
    onClose(false);
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h4>Save Photo</h4>
        <div className={styles.imageContainer}>
          <img className={styles.img} src={fileUrl} alt="Preview" />
        </div>
        <button className={styles.saveButton} onClick={saveHandle}>
          Save
        </button>
        <button className={styles.closeButton} onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
