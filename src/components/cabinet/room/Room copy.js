import iconBed from "../images/iconBed.png";
import iconDoubleBed from "../images/iconDoubleBed.png";
import iconArea from "../images/iconArea.png";
import iconRoom from "../images/iconRoom.png";
import iconHostel from "../images/iconHostel.png";
import iconDesk from "../images/iconDesk.png";
import Advant from "./Advant";
import Advants from "./Advants";
import styles from "./Room.module.css";
import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addLike,removeLike } from "../../../store/likes-slice";

import RoomInfo from "./RoomInfo";

export default function Room(props) {
  const [isShowInfo, setIsShowInfo] = useState(false);

  const {
    advants,
    structure,
    name,
    images,
    aboutApartment,
    roomsCount,
    area,
    price,
    advant,
    personId,
  } = props.room;

  // const dispatch = useDispatch();
  const advantArray = advant
    ? Object.entries(advant)
        .filter(([key, value]) => value === true)
        .map(([key, value]) => key)
    : [];

  // const likeHandler = () => {
  //   if (props.clientId && personId) {
  //     dispatch(addLike(props.clientId, personId));
  //   }
  // };
  // const dislikeHandler = () => {
  //   if (personId) {
  //     dispatch(removeLike(personId));
  //   }
  // };

  const showCloseHandler = () => {
    setIsShowInfo(false);
  };

  return (
    <>
      {isShowInfo ? (
        <RoomInfo id={personId} onClick={showCloseHandler} />
      ) : (
        <>
          <div className={styles.box}>
            <div onClick={() => setIsShowInfo(true)}>
              <img
                className={styles.image}
                src={
                  images?.find((image) => !!image) ||
                  "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                }
                alt="room"
              />
              {/* <span className={styles.likes}>
            <button className={styles.buttonLikes} onClick={likeHandler} >
              <img
                width="40"
                height="40"
                src="https://img.icons8.com/ultraviolet/40/like--v1.png"
                alt="like--v1"
              />{" "}
            </button>
            <i className="fas fa-exchange-alt"></i>
          </span> */}
            </div>
            <div className={styles.bottom}>
              <h3 className={styles.title}>{name}</h3>
              {/* <p className={styles.description}>{aboutApartment}</p> */}
              <div className={styles.advants}>
                {structure !== "bunk-bed" ? (
                  <Advant icon={iconRoom} count={roomsCount} />
                ) : (
                  <Advant icon={iconHostel} count={roomsCount} />
                )}
                <Advant icon={iconArea} count={area} />
                {advants?.desk && (
                  <Advant icon={iconDesk} count={advants?.desk} />
                )}
                {advants?.single_bed && (
                  <Advant icon={iconBed} count={advants?.single_bed} />
                )}
                {advants?.double_bed && (
                  <Advant icon={iconDoubleBed} count={advants?.double_bed} />
                )}
                {advantArray
                  ? advantArray.map((adv) => <Advants key={adv} name={adv} />)
                  : ""}
              </div>
              <div className={styles.price}>
                <span>For Sale </span>
                <p>{price} USD</p>
              </div>
             
            </div>
          </div>
        </>
      )}
    </>
  );
}
