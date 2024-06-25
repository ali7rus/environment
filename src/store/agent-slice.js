import { roomAction } from "./room-slice";
import { createSlice } from "@reduxjs/toolkit";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  get,
query,equalTo,orderByChild,
  serverTimestamp,
  update,
} from "firebase/database";

const agentSlice = createSlice({
    name: "agent",
    initialState: { rooms: [] },
    reducers: {
      addAgentRoom: (state, action) => {
        state.rooms.push(action.payload);
      },
    },
  });
  
  export const agentActions = agentSlice.actions;
  
  export default agentSlice.reducer;
  
  // Изменение функции addRoom
  export const addRoom = (clientId, activeRoom) => {
    return async (dispatch, getState) => {
      // ... ваш код ...
  
      // Проверка, является ли пользователь агентом
      const isAgent = getState().user.isAgent; // предполагается, что у вас есть слайс пользователя, который содержит информацию о том, является ли пользователь агентом
  
      // Если пользователь является агентом, добавить комнату в слайс агентов
      if (isAgent) {
        dispatch(agentActions.addAgentRoom(newRoom));
      } else {
        dispatch(roomAction.createRoom(newRoom));
        dispatch(roomAction.setActiveRoomId(newRoom.roomId));
      }
    };
  };