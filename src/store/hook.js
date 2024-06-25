import {  useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { getUserLikes } from "./likes-slice";

export const useClientData = () => {
  // console.log("useClientData");
  const { user } = useAuth0();
  const clientId = user?.sub.split("|")[1];

  // useEffect(() => {
  //   // Сообщите серверу, что этот клиент ассоциирован с определенным идентификатором пользователя
  //   socket.emit("register", clientId);
  // }, [clientId]);

  const roomsState= useSelector((state) => state.rooms.rooms);

  const allRooms = useSelector((state) => state.rooms.allRooms);

  const rooms = useMemo(() => {
    return roomsState.filter((room) => room.userId !== clientId);
  }, [roomsState, clientId]);



  const roomId = useSelector((state) => state.room.activeRoomId);
  const room = useSelector((state) =>
    state.room.rooms.find((room) => room.personId === roomId)
  );
  const myRooms = useSelector((state) => state.room.rooms);

  const roomActive = myRooms.find((person) => person.isActive === true);
  
  const personId = useSelector((state) => state.user.activePersonId);
  const person = useSelector((state) =>
    state.user.users.find((person) => person.personId === personId)
  );
  const myPersons = useSelector((state) => state.user.users);
  const chatPerson = myPersons.find((person) => person.isActive === true);

  const usersAll = useSelector((state) => state.users.users);

  const personsAll = useSelector((state) => state.users.persons);

  const users = useMemo(() => {
    return usersAll.filter(
      (person) => person.userId !== clientId && person.status !== "unfinished"
    );
  }, [usersAll, clientId]);

  const city = useSelector((state) => state.main.city);

  const usersCity = useMemo(() => {
    return users.filter((user) => user.map === city);
  }, [users, city]);

  const myLikesData = useSelector((state) => getUserLikes(state, chatPerson?.personId));
  // console.log("myLikesData hhhhhh", myLikesData);

  const myFilteredUsers = useMemo(() => {
    return  users.filter(
      (user) => !myLikesData.some((like) => like.likedByUserId === user.personId)
    );
  }, [users, myLikesData]);

  // console.log('person all hhhhhhhhhh',users);

  return {
    clientId,
    rooms,
    users,
    personsAll,
    allRooms,
    room,
    person,
    chatPerson,
    usersCity,
    myFilteredUsers,
    roomId,
    personId,
    myRooms,
    myPersons,
    roomActive,
  };
};
