import { createSlice } from "@reduxjs/toolkit";
import {
  getDatabase,onValue,off,
  ref,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";

const initialState = {
  rooms: [],
  allRooms:[],
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateRooms(state, action) {
      state.rooms = action.payload;
    },
    updateAllRooms(state, action) {
      state.allRooms = action.payload;
    },
  },
});

export const roomsAction = roomsSlice.actions;

export default roomsSlice.reducer;

let roomsListener = null;
let finishedRoomsListener= null;

export const subscribeToRoomsData = () => {
  return async (dispatch) => {
    try {
      const db = getDatabase();
      const roomsRef = ref(db, "rooms/");

      const finishedRoomsRef = query(roomsRef, orderByChild('status'), equalTo('finished'));

      finishedRoomsListener = onValue(finishedRoomsRef, (snapshot) => {
        const allRoomsData = snapshot.val();
  
        if (allRoomsData) {
        const allRoomsArray = Object.values(allRoomsData);
          dispatch(roomsAction.updateAllRooms(allRoomsArray));
        }
      });

      const activeRoomsRef = query(roomsRef, orderByChild('isActive'), equalTo(true));

      // Подписываемся на изменения данных
      roomsListener = onValue(activeRoomsRef, (snapshot) => {
        const roomsData = snapshot.val();
        // Обновляем состояние Redux при каждом изменении данных
        if (roomsData) {
          const dataArray = Object.values(roomsData);
          dispatch(roomsAction.updateRooms(dataArray));
        }
      });
    } catch (error) {
      console.error('Error in subscribeToRoomsData:', error);
    }
  };
};

export const unsubscribeFromRoomsData = () => {
  return async (dispatch) => {
    const db = getDatabase();
    const roomsRef = ref(db, "rooms/");

    // Отменяем подписку на изменения данных
    if (roomsListener && finishedRoomsListener) {
      off(roomsRef, "value", roomsListener);
      off(roomsRef, "value", finishedRoomsListener);
      roomsListener = null;
      finishedRoomsListener = null;
    }
  };
};

