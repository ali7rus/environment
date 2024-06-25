import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { deleteObject } from "firebase/storage";
import { storage } from "../../firebaseConfig.js";
import { useDispatch } from "react-redux";
import styles from "./PhotoLoad.module.css";
import Modal from "../../UI/Modal.js";

const ImageSlot = ({
  fileUrl,
  index,
  removeImage,
  handleImageChange,
}) => {
  return (
    <div className={styles.imageContainer}>
      {fileUrl ? (
        <>
          <img className={styles.img} src={fileUrl} alt="preview" />
          <button
            className={styles.removeButton}
            onClick={() => removeImage(index)}
          >
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/stickers/30/000000/delete-sign.png"
              alt="delete-sign"
            />
          </button>
        </>
      ) : (
        <>
          <input
            className={styles.inputfile}
            type="file"
            id={`file-${index}`}
            onChange={(e) => handleImageChange(e, index)}
            required
          />
          <label className={styles.labelphoto} htmlFor={`file-${index}`}>
            <img
              width="96"
              height="96"
              src="https://img.icons8.com/sf-regular/96/daecfa/image-gallery.png"
              alt="gallery"
            />
          </label>
        </>
      )}
    </div>
  );
};

const PhotoLoad = (props) => {
 
  const [files, setFiles] = useState([null, null, null, null]);
  const [fileUrls, setFileUrls] = useState(props.data?.images || [null, null, null, null]);
  const [showModal, setShowModal] = useState(false); // новое состояние для модального окна
  const [tempFile, setTempFile] = useState(null); // временное состояние для файла
  const [tempIndex, setTempIndex] = useState(null); // временное состояние для индекса
  const dispatch = useDispatch();


  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file && file.size >= 2000 && file.size <= 5005833) {
      setTempFile(file); // сохраняем файл во временное состояние

      setTempIndex(index); // сохраняем индекс во временное состояние
      setShowModal(true); // открываем модальное окно
    } else {
      alert("File size should be between 2 KB and 5 MB.");
    }
  };
  const handleModalClose = async (shouldSave) => {
    if (shouldSave) {
      const newFiles = [...files];
      newFiles[tempIndex] = tempFile;
      setFiles(newFiles);
      const newUrls = [...fileUrls];
      newUrls[tempIndex] = URL.createObjectURL(tempFile);
      setFileUrls(newUrls);

      // Загрузка файла на сервер
      const file = tempFile;
      if (file) {
        const storageRef = ref(
          storage,
          `${props.id}/${props.nameFile}${tempIndex + 1}`
        );
        try {
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          dispatch(props.action.getPhoto({ image: url,index:tempIndex ,id: props.id }));
        
          console.log("Photo uploaded successfully");
        } catch (error) {
          console.error(error);
        }
      }
    }
    setTempFile(null);
    setTempIndex(null);
    setShowModal(false); // закрываем модальное окно
  };

  const removeImage = async (indexToRemove) => {
    let newFiles = [...files];
    console.log(fileUrls)
    let newFileUrls = [...fileUrls];
    newFiles[indexToRemove] = null;
    newFileUrls[indexToRemove] = null;
    setFiles(newFiles);
    setFileUrls(newFileUrls);
    const storageRef = ref(storage, `${props.id}/${props.nameFile}${indexToRemove + 1}`);
    try {
      await deleteObject(storageRef);
      dispatch(props.action.deletePhoto({ index:indexToRemove , id: props.id }));
      console.log("Photo deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Сброс состояния
    setFiles([null, null, null, null]);
    setFileUrls(props.data?.images || [null, null, null, null]);
  }, [props.id]);

 
  return (
    <div className={styles.container1}>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <ImageSlot
            key={index}
            fileUrl={fileUrls[index]}
            index={index}
            removeImage={removeImage}
            handleImageChange={handleImageChange}
          />
        ))}
      {showModal && (
        <Modal isOpen={showModal} file={tempFile} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default PhotoLoad;
