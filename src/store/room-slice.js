import { createSlice } from "@reduxjs/toolkit";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  get,
  query,
  equalTo,
  orderByChild,
  serverTimestamp,
  update,
} from "firebase/database";

const initialState = {
  activeRoomId: null,
  rooms: [],
  roomsQuantity: 0,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    createRoom(state, action) {
      const newRoom = action.payload; // Генерируем новый ID
      state.rooms.push(newRoom); // Добавляем новую комнату
      state.roomsQuantity++;
    },
    setActiveRoomId: (state, action) => {
      state.activeRoomId = action.payload;
    },

    getPhoto(state, action) {
      const { id, image, index } = action.payload;
      const roomToUpdate = state.rooms.find((room) => room.personId === id);

      if (roomToUpdate) {
        return {
          ...state,
          rooms: state.rooms.map((room) =>
            room.personId === id
              ? { ...room, images: { ...room.images, [index]: image } }
              : room
          ),
        };
      } else {
        console.log("not room photo to update!");
        return state;
      }
    },
    deletePhoto(state, action) {
      const { id, index } = action.payload;
      const roomToUpdate = state.rooms.find((room) => room.personId === id);

      if (roomToUpdate) {
        roomToUpdate.images[index] = null;
      }
    },

    removeRoom(state, action) {
      const personId = action.payload;
      // Теперь это должен быть roomId объявления
      state.roomsQuantity--;
      state.rooms = state.rooms.filter((room) => room.personId !== personId);
    },
    updateRoomData(state, action) {
      const newData = action.payload;

      if (newData.images && typeof newData.images === "object") {
        // Создаем пустой массив определенной длины (4 в данном случае)
        let imagesArray = Array(4).fill(null);

        // Заполняем массив изображениями
        for (let key in newData.images) {
          imagesArray[key] = newData.images[key];
        }

        // Присваиваем новый массив изображений объекту newData
        newData.images = imagesArray;
      }

      let roomIndex = state.rooms.findIndex(
        (room) => room.personId === newData.personId
      );
      console.log("roomIndex", roomIndex);
      if (roomIndex !== -1) {
        state.rooms[roomIndex] = newData;
        //state.isRoomContentChanged = true;
      }
    },
    toggleActiveRoom(state, action) {
      // Перебираем все комнаты
      state.rooms.forEach((room) => {
        // Если ID комнаты совпадает с переданным ID, то ставим этой комнате статус "isActive true"
        if (room.personId === action.payload) {
          room.isActive = true;
        }
        // Если ID комнаты не совпадает с переданным ID, то ставим этой комнате статус "isActive false"
        else {
          room.isActive = false;
        }
      });
    },
    // updateRoom(state, action) {
    //   state.rooms.push(action.payload);
    // },
    addOrUpdateRoom: (state, action) => {
      const index = state.rooms.findIndex(
        (room) => room.personId === action.payload.personId
      );

      if (index !== -1) {
        // Обновляем комнату, если она уже существует
        state.rooms[index] = action.payload;
      } else {
        // Добавляем комнату, если она еще не существует
        // Проверяем, есть ли поле images в payload и является ли оно массивом
        if (Array.isArray(action.payload.images)) {
          state.rooms.push({
            ...action.payload,
            images: [...action.payload.images],
          });
        } else {
          state.rooms.push(action.payload);
        }
      }
    },
  },
});

export const roomAction = roomSlice.actions;

export default roomSlice.reducer;

export const addRoom = (clientId, activeRoom) => {
  return async (dispatch, getState) => {
    if (!clientId) {
      console.error("clientId is undefined");
      return;
    }

    const roomStatus = activeRoom ? activeRoom.status : null;

    const db = getDatabase();

    if (roomStatus === "unfinished") {
      alert(
        "У вас уже есть незавершенная комната. Завершите или удалите ее перед созданием новой."
      );
    } else {
      console.log("No active room found.");
      // Создать новую комнату...const newRoom = {
      const newRoom = {
        userId: clientId,
        status: "unfinished",
        timestamp: serverTimestamp(),
        isActive: false,
        images: [null, null, null, null], // по умолчанию комната неактивна
      };

      // Проверка, есть ли уже комнаты у данного пользователя
      const userRooms = getState().room.rooms.filter(
        (room) => room.userId === clientId
      );

      if (userRooms.length === 0) {
        // Если у пользователя еще нет комнат, делаем эту комнату активной
        newRoom.isActive = true;
      }

      // Создайте новую комнату в Firebase и получите уникальный ключ комнаты
      const newRoomRef = push(ref(db, "rooms/"));
      // Добавьте уникальный ключ в объект newRoom
      newRoom.personId = newRoomRef.key;

      // Загрузите объект newRoom в Firebase
      await set(newRoomRef, newRoom);

      // Установить новый ключ комнаты как активный
      const userRef = ref(db, "users/" + clientId);
      await update(userRef, { activeRoomId: newRoom.personId });

      dispatch(roomAction.createRoom(newRoom));
      dispatch(roomAction.setActiveRoomId(newRoom.personId));
    }
  };
};

export const removeRoom = (personId, clientId) => {
  return async (dispatch, getState) => {
    if (!personId) {
      console.error("roomId is undefined");
      return;
    }

    const state = getState();
    const userRooms = state.room.rooms.filter(
      (room) => room.userId === clientId
    );

    // Найдем комнату, которую собираемся удалить
    const deletedRoom = userRooms.find((room) => room.personId === personId);

    const db = getDatabase();

    const roomRef = ref(db, "rooms/" + personId);
    await remove(roomRef);

    dispatch(roomAction.removeRoom(personId));

    // Если удаляемая комната была активной
    if (deletedRoom && deletedRoom.isActive) {
      // Если у пользователя остались другие комнаты после удаления
      const remainingRooms = userRooms.filter(
        (room) => room.personId !== personId
      );
      if (remainingRooms.length > 0) {
        // Назначим первую из оставшихся комнат как активную
        const newActiveRoom = { ...remainingRooms[0], isActive: true };

        // Обновим данные этой комнаты в Firebase
        const newActiveRoomRef = ref(db, "rooms/" + newActiveRoom.personId);
        await update(newActiveRoomRef, newActiveRoom);

        // Обновим состояние Redux
        dispatch(roomAction.updateRoomData(newActiveRoom));
      }
    }
  };
};

export const setActiveRoom = (personId) => {
  return async (dispatch, getState) => {
    const db = getDatabase();
    const { rooms } = getState().room; // Получаем список комнат из состояния

    // Обновляем данные в Firebase
    for (let room of rooms) {
      const roomRef = ref(db, "rooms/" + room.personId);
      if (room.personId === personId) {
        await update(roomRef, { isActive: true });
      } else {
        await update(roomRef, { isActive: false });
      }
    }

    // Вызываем action для обновления состояния в Redux
    dispatch(roomAction.toggleActiveRoom(personId));
  };
};

export const updateRoomData = (roomId, data) => {
  return async (dispatch) => {
    const db = getDatabase();

    // Получить ссылку на комнату
    const roomRef = ref(db, "rooms/" + roomId);

    // Обновить свойство 'name'
    await update(roomRef, data);

    // Загрузить обновленные данные комнаты
    const snapshot = await get(roomRef);
    const roomData = snapshot.val();
    // Обновить состояние комнаты в Redux
    dispatch(roomAction.updateRoomData(roomData));
  };
};

export const loadAllUserRooms = (clientId) => {
  return async (dispatch) => {
    const db = getDatabase();

    // Получить ссылку на все комнаты пользователя
    if (clientId) {
      const userRoomsRef = ref(db, "rooms/");
      const filteredRoomsRef = query(
        userRoomsRef,
        orderByChild("userId"),
        equalTo(clientId)
      );
      const userRoomsSnapshot = await get(filteredRoomsRef);
      const userRoomsData = userRoomsSnapshot.val();
      const userRef = ref(db, "users/" + clientId);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData.activeRoomId) {
        const activeRoomId = userData.activeRoomId;
        dispatch(roomAction.setActiveRoomId(activeRoomId));
      }
      // Если есть данные, обновляем состояние Redux для каждой комнаты

      if (userRoomsData) {
        for (const personId in userRoomsData) {
          let roomData = userRoomsData[personId];
          // Преобразование images в массив, если оно существует и является объектом
          if (roomData.images && typeof roomData.images === "object") {
            let imagesArray = Array(4).fill(null); // Массив из 4 элементов
            for (let key in roomData.images) {
              imagesArray[key] = roomData.images[key];
            }
            roomData.images = imagesArray; // Обновление объекта roomData
          }
          dispatch(roomAction.addOrUpdateRoom(roomData));
        }
      }
    } else {
      console.error("clientId is undefined");
    }
  };
};
