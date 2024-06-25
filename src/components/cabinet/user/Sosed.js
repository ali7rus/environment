import styles from "./Sosed.module.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import UserInfo from "./UserInfo";
import ButtonCard from "../../UI/ButtonCard";
import { addLike, removeLike } from "../../../store/likes-slice";
import { useSwipeable } from "react-swipeable";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import Advants from "./Advants";
// import { useRef } from "react";

const Sosed = (props) => {
  const dispatch = useDispatch();
  // const ref = useRef(null);

  const [isShowInfo, setIsShowInfo] = useState(false);
  // const [isDragging, setIsDragging] = useState(false);
  // const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  // const [rotation, setRotation] = useState(0);

  const {
    name,
    work,
    aboutme,
    images,
    map,
    age,
    personId,
    interests,
    interest,
  } = props.user;

  let maxLength = 83;
  let trimmedText =
    aboutme?.length > maxLength
      ? aboutme.substring(0, maxLength) + "..."
      : aboutme;

  const image = images?.[0] || images?.[1] || images?.[2] || images?.[3];

  const interestArray = interest
    ? Object.entries(interest)
        .filter(([key, value]) => value === true)
        .map(([key, value]) => key)
    : [];

  const likeHandler = () => {
    if (props.clientId && personId) {
      dispatch(addLike(props.clientId, personId));
    }
  };
  const dislikeHandler = () => {
    if (personId) {
      dispatch(removeLike(personId));
    }
  };

  const showCloseHandler = () => {
    setIsShowInfo(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => console.log("Swiped left!"),
    onSwipedRight: () => console.log("Swiped right!"),
    trackTouch: true, // отслеживание сенсорного ввода
  });

  const [{ isDragging, offset }, drag, preview] = useDrag({
    type: "myUniqueType",
    item: (monitor) => {
      return {
        id: personId,
        monitor,
      };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
        offset: monitor.getClientOffset(),
      };
    },
  });

  let userStyle;
  if (isDragging && offset) {
    userStyle = {
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      opacity: 0.01,
    };
  }
  //

  return (
    <>
      <UserInfo
        id={personId}
        onClick={showCloseHandler}
        style={{ display: isShowInfo ? "block" : "none" }}
      />
      <div {...handlers} style={{ display: isShowInfo ? "none" : "block" }}>
        <motion.div ref={drag} style={userStyle}>
          <div className={styles.user}>
            <div onClick={() => setIsShowInfo(true)}>
              <img className={styles.imageCard} src={image} alt="user" />
            </div>
            <div className={styles.cardButton}>
            {/* <motion.button
  style={{
    backgroundColor: "transparent",
    border: "none",
    padding: "5px",
    cursor: "pointer",
    borderRadius: "32px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
  }}
  whileHover={{ scale: 1.1 }}
  transition={{ duration: 0.2 }}
> */}
                <ButtonCard onClick={likeHandler} type="favorite"></ButtonCard>
              {/* </motion.button> */}
              <ButtonCard onClick={dislikeHandler}></ButtonCard>
            </div>
            <div className={styles.data}>
              <h3>
                {name},{age}
              </h3>
            </div>
            <div className={styles.advants}>
              {interestArray
                ? interestArray
                    .slice(0, 6)
                    .map((adv) => <Advants key={adv} name={adv} />)
                : ""}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};
export default Sosed;


// import styles from "./Sosed.module.css";
// import { useDispatch } from "react-redux";
// import { useState, useEffect } from "react";
// import UserInfo from "./UserInfo";
// import ButtonCard from "../../UI/ButtonCard";
// import { addLike, removeLike } from "../../../store/likes-slice";
// import { motion } from "framer-motion";
// import Advants from "./Advants";

// const Sosed = (props) => {
//   const dispatch = useDispatch();

//   const [isShowInfo, setIsShowInfo] = useState(false);

//   const {
//     name,
//     work,
//     aboutme,
//     images,
//     map,
//     age,
//     personId,
//     interests,
//     interest,
//   } = props.user;

//   let maxLength = 83;
//   let trimmedText =
//     aboutme?.length > maxLength
//       ? aboutme.substring(0, maxLength) + "..."
//       : aboutme;

//   const image = images?.[0] || images?.[1] || images?.[2] || images?.[3];

//   const interestArray = interest
//     ? Object.entries(interest)
//         .filter(([key, value]) => value === true)
//         .map(([key, value]) => key)
//     : [];

//   const likeHandler = () => {
//     if (props.clientId && personId) {
//       dispatch(addLike(props.clientId, personId));
//     }
//   };

//   const dislikeHandler = () => {
//     if (personId) {
//       dispatch(removeLike(personId));
//     }
//   };

//   const showCloseHandler = () => {
//     setIsShowInfo(false);
//   };

//   return (
//     <>
//       <UserInfo
//         id={personId}
//         onClick={showCloseHandler}
//         style={{ display: isShowInfo ? "block" : "none" }}
//       />
//       <motion.div>
//         <div className={styles.user}>
//           <div onClick={() => setIsShowInfo(true)}>
//             <img className={styles.imageCard} src={image} alt="user" />
//           </div>
//           <div className={styles.cardButton}>
//             <ButtonCard onClick={likeHandler} type="favorite"></ButtonCard>
//             <ButtonCard onClick={dislikeHandler}></ButtonCard>
//           </div>
//           <div className={styles.data}>
//             <h3>
//               {name},{age}
//             </h3>
//           </div>
//           <div className={styles.advants}>
//             {interestArray
//               ? interestArray
//                   .slice(0, 6)
//                   .map((adv) => <Advants key={adv} name={adv} />)
//               : ""}
//           </div>
//         </div>
//       </motion.div>
//     </>
//   );
// };
// export default Sosed;