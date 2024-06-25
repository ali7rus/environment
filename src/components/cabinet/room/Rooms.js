import Room from "./Room copy";
import styles from "./Rooms.module.css";
import { useClientData } from "../../../store/hook";
import { getRoomLikes } from "../../../store/likes-slice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
const Rooms = () => {
  const { chatPerson, rooms } = useClientData();
  console.log('rooms rrrrrrrrrrrrrrrrrr', rooms);
  console.log('chatPerson rrrrrrrrrrrrrrr',chatPerson);

  const mutualMyLikesRoomData = useSelector((state) =>
  getRoomLikes(state, chatPerson?.personId)
);
console.log('mutualMyLikesRoomData rrrrrrrrrrrrrrr',mutualMyLikesRoomData);
const filteredAgents = useMemo(() => {
  return rooms
    .map((room) => {
      const likeData = mutualMyLikesRoomData.find(
        (data) => data.likedByRoomId === room.personId
      );
      if (likeData) {
        return { ...room, likeId: likeData.id };
      }
      return room;
    })
    .filter((room) => room.likeId === undefined && room.personId !== chatPerson?.personId);
}, [rooms, mutualMyLikesRoomData,chatPerson?.personId]);
  return (
    <div className={styles.box}>
      <p className={styles.title}>В нашем приложении вы найдете жильё</p>
      <div className={styles.container}>
        {!rooms ? (
          <h2>список пуст</h2>
        ) : (
          filteredAgents.map((room) => (
            <Room key={room.personId} room={room} clientId={chatPerson?.personId} />
          ))
        )}
      </div>
    </div>
  );
};
export default Rooms;
