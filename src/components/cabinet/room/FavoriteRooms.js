import styles from "./FavoriteUser.module.css";
import { useDispatch, useSelector } from "react-redux";
import { removeLike, getUserLikes,getMutualLikes } from "../../../store/likes-slice";
import { createRef } from "react";
import { useClientData } from "../../../store/hook";
import Reception from "../Reception";
import { useState,useMemo } from "react";
import  log  from "loglevel";


const FavoriteRooms = () => {
  const [partner, setPartner] = useState(null);
  const { clientId, usersArray } = useClientData();
const dispatch = useDispatch()

  const mutualLikesData = useSelector((state) =>
    getMutualLikes(state, clientId)
  );
  const mutualMyLikesData = useSelector((state) => getUserLikes(state, clientId));
  ;
  // const linkRef = createRef();

 
  const filteredusers = useMemo(() => {
    return usersArray
      .map(user => {
        const likeData = mutualLikesData.find(data => data.userId === user.id);
        if(likeData) {
          return {...user, likeId: likeData.id};
        }
        return user;
      })
      .filter(user => user.likeId !== undefined && user.id !==clientId )
  }, [usersArray, mutualLikesData, clientId]);
  
  const dislikeHandler = () => {
    if (partner.likeId) {
      dispatch(removeLike(partner.likeId));
      // Get current state
      const myLike = mutualMyLikesData.find(
        (data) => data.likedByUserId === partner.id
      );
      if (myLike) {
        dispatch(removeLike(myLike.id));
      }
    }
    setPartner(null);
  };
  return (
    <>
      <div className={styles.card}>
       
         {partner ? (
          <Reception partner={partner} onDislike={dislikeHandler} />
        ) : (
          filteredusers.map((room) => (
            <div
              onClick={() => setPartner(room)}
              className={styles.content}
              key={room.id}
            >
              <img
                src={
                  room.images?.find((image) => !!image) ||
                  "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                }
                alt={room.name}
                className={styles.userImage}
              />
              <p>{room.street}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default FavoriteRooms;
// {/* <a
//       ref={linkRef}
//       href={`tg://resolve?domain=${props.nikName || ""}`}
//       style={{ display: "none" }}
//     >
//       Отправить сообщение
//     </a> */}
