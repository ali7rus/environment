import { useSelector} from 'react-redux';
import { useMemo } from 'react';

import { getMutualLikes, getRoomLikes, getUsersLikedByClient } from "./likes-slice";
import { useClientData } from "./hook";

export const useUsersArray = (personId) => {
  const { personsAll, allRooms } = useClientData();

  const mutualLikesData = useSelector((state) =>
    getMutualLikes(state, personId)
  );

  const mutualMyLikesRoomData = useSelector((state) =>
    getRoomLikes(state, personId)
  );
  const partnersData = useSelector((state) =>
    getUsersLikedByClient(state, personId)
  );

  const filteredAgents = useMemo(() => {
    return allRooms
      .map((room) => {
        const likeData = mutualMyLikesRoomData.find(
          (data) => data.likedByRoomId === room.personId
        );
        if (likeData) {
          return { ...room, likeId: likeData.id };
        }
        return room;
      })
      .filter((room) => room.likeId !== undefined && room.personId !== personId);
  }, [allRooms, mutualMyLikesRoomData, personId]);

  const filteredUsers = useMemo(() => {
    return personsAll
      .map((user) => {
        const likeData = partnersData.find(
          (data) => data.userId === user.personId
        );
        if (likeData) {
          return { ...user, likeId: likeData.id };
        }
        return user;
      })
      .filter(
        (user) => user.likeId !== undefined && user.personId !== personId
      );
  }, [personsAll, partnersData, personId]);

  const filteredPersons = useMemo(() => {
    return personsAll
      .map((user) => {
        const likeData = mutualLikesData.find(
          (data) => data.userId === user.personId
        );
        if (likeData) {
          return { ...user, likeId: likeData.id };
        }
        return user;
      })
      .filter(
        (user) => user.likeId !== undefined && user.personId !== personId
      );
  }, [personsAll, mutualLikesData, personId]);

  return useMemo(
    () => [...filteredUsers, ...filteredPersons,...filteredAgents ],
    [filteredUsers, filteredPersons,filteredAgents ]
  );
};
// 