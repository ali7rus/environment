import { useState} from "react";
import { Tooltip } from "react-tooltip";
import { useClientData } from "../../store/hook";
import iconMesage from "./icons/iconMesage.png";
import { Link } from "react-router-dom";
import UserInfo from "./user/UserInfo";
import RoomInfo from "./room/RoomInfo";
import styles from "./CabinetUser.module.css";
import iconEdit from "./icons/iconEdit.png";
import iconRemove from "./icons/iconRemove.png";
import iconShare from "./icons/iconShare.png";
import iconIncrease from "./icons/iconIncrease.png";
import iconInfo from "./icons/iconInfo.png";
import {
  userAction,
  setActivePerson,
  removePerson,
} from "../../store/user-slice";
import { useNavigate } from "react-router-dom";
import { roomAction, removeRoom, setActiveRoom,} from "../../store/room-slice";
import { useDispatch } from "react-redux";
import socket from "../../sockets";

const CabinetUser = () => {
console.log('cabinetUser');
  const { myRooms, myPersons, clientId } = useClientData();
  const [id, setId] = useState(false);
  
  const [showPersonId, setShowPersonId] = useState(false);
  const [arrayShareRoom, setArrayShareRoom] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("arrayShareRoom", arrayShareRoom);

  const showCloseUserHandler = () => {
    setShowPersonId(false);
  };
  const showCloseRoomHandler = () => {
    setId(false);
  };

  const deletePersonHandler = async (personId) => {
    await dispatch(removePerson(personId, clientId));
  };
  const deleteRoomHandler =async (personId) => {
    await  dispatch(removeRoom(personId, clientId));
  };

  const activeRoomHandler = (personId) => {
    dispatch(setActiveRoom(personId));
  };

  const activePersonHandler = (personId) => {
    dispatch(setActivePerson(personId));
  };

  const chatPersonHandler=(personId)=>{
    socket.emit("register", personId); // Зарегистрируйте пользователя при подключении
    navigate(`/message/${personId}`)
   
  }

  // useEffect(() => {
   
  //   console.log('register', personId);
   
  // }, [personId]);

  return (
    <div className={styles.containerOne}>
      {myPersons && !showPersonId ? (
        myPersons.map((person) => (
          <div className={styles.cardWrapper} key={person.personId}>
            <div className={styles.card}>
              <div className={styles.cardImage}>
                <img
                  className={styles.userImage}
                  src={
                    (Array.isArray(person.images)
                      ? person.images.find((image) => !!image)
                      : person.images) ||
                    "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                  }
                  alt="profile one"
                />
              </div>

              <ul className={styles.socialIcons}>
                <li>
                  <button onClick={() => activePersonHandler(person.personId)}>
                    <img
                      src={iconInfo}
                      alt="external-edit-interface-kiranshastry-solid-kiranshastry"
                    />
                  </button>
                </li>
                <li>
                  <button>
                    <Link
                      to="/regusergeneral"
                      onClick={() =>
                        dispatch(userAction.setActivePersonId(person.personId))
                      }
                    >
                      <img
                        src={iconEdit}
                        alt="external-edit-interface-kiranshastry-solid-kiranshastry"
                      />
                    </Link>
                  </button>
                </li>
                <li>
                  <button onClick={() => deletePersonHandler(person.personId)}>
                    <img src={iconRemove} alt="filled-trash" />
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowPersonId(person.personId)}>
                    <img src={iconIncrease} alt="expand" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => chatPersonHandler(person.personId)}>
                    <img src={iconMesage} alt="filled-trash" />
                  </button>
                </li>
              </ul>

              <div className={styles.details}>
                <h2>
                  {person.name}
                  <br />
                  <span className={styles.jobTitle}>{person.work}</span>{" "}
                  {person.isActive && (
                    <span className={styles.jobTitle}>{"Active Person"}</span>
                  )}
                </h2>
              </div>
            </div>
          </div>
        ))
      ) : (
        <UserInfo id={showPersonId} onClick={showCloseUserHandler} />
      )}

      {myRooms &&
        (!id ? (
          myRooms.map((room) => (
            <div className={styles.cardWrapper} key={room.personId}>
              <div className={styles.card}>
                <div className={styles.cardImage}>
                  <img
                    className={styles.userImage}
                    src={
                      (Array.isArray(room.images)
                        ? room.images?.find((image) => !!image)
                        : room.images) ||
                      "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                    }
                    alt="room"
                  />
                </div>

                <ul className={styles.socialIcons} style={{ left: "155px" }}>
                  <li>
                    <button onClick={() => activeRoomHandler(room.personId)}>
                      <img
                        src={iconInfo}
                        alt="external-edit-interface-kiranshastry-solid-kiranshastry"
                      />
                    </button>
                  </li>
                  <li>
                    <button>
                      <Link
                        to="/regroommain"
                        onClick={() =>
                          dispatch(roomAction.setActiveRoomId(room.personId))
                        }
                      >
                        <img
                          src={iconEdit}
                          alt="external-edit-interface-kiranshastry-solid-kiranshastry"
                        />
                      </Link>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => deleteRoomHandler(room.personId)}>
                      <img src={iconRemove} alt="filled-trash" />
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setId(room.personId)}>
                      <img src={iconIncrease} alt="expand" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        setArrayShareRoom((prev) => [...prev, room.personId])
                      }
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="publish the questionnaire"
                    >
                      <Tooltip id="my-tooltip" />
                      <img src={iconShare} alt="filled-trash" />
                    </button>
                  </li>
                  <li>
                    <button onClick={() => chatPersonHandler(room.personId)} >
                        <img src={iconMesage} alt="" />
                    </button>
                  </li>
                </ul>

                <div className={styles.details}>
                  <h2>
                    {room.name}
                    <br />
                    {room.isActive && (
                      <span className={styles.jobTitle}>{"Active House"}</span>
                    )}
                  </h2>
                </div>
              </div>
            </div>
          ))
        ) : (
          <RoomInfo id={id} onClick={showCloseRoomHandler} />
        ))}
    </div>
  );
};

export default CabinetUser;
