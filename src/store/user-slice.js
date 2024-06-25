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
  users: [],
  activePersonId: null,
  usersQuantity: 0,
  chatId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createPerson(state, action) {
      const newPerson = action.payload; // Генерируем новый ID
      state.users.push(newPerson); // Добавляем новую личность
      state.usersQuantity++;
    },
    setActivePersonId: (state, action) => {
      state.activePersonId = action.payload;
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    removePerson(state, action) {
      const personId = action.payload; // Теперь это должен быть personId личности
      state.usersQuantity--;
      state.users = state.users.filter(
        (person) => person.personId !== personId
      );
    },
    updatePersonData(state, action) {
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

      let personIndex = state.users.findIndex(
        (person) => person.personId === newData.personId
      );

      if (personIndex !== -1) {
        state.users[personIndex] = newData;
        // state.isRoomContentChanged = true;
      }
    },
    toggleActiveRoom(state, action) {
      // Перебираем все комнаты
      state.users.forEach((person) => {
        // Если ID персоны совпадает с переданным ID, то ставим этой персоне статус "isActive true"
        if (person.personId === action.payload) {
          person.isActive = true;
        }
        // Если ID комнаты не совпадает с переданным ID, то ставим этой комнате статус "isActive false"
        else {
          person.isActive = false;
        }
      });
    },
    addOrUpdatePerson: (state, action) => {
      const index = state.users.findIndex(
        (person) => person.personId === action.payload.personId
      );

      if (index !== -1) {
        // Обновляем комнату, если она уже существует
        state.users[index] = action.payload;
      } else {
        // Добавляем персону, если она еще не существует
        // Проверяем, есть ли поле images в payload и является ли оно массивом
        if (Array.isArray(action.payload.images)) {
          state.users.push({
            ...action.payload,
            images: [...action.payload.images],
          });
        } else {
          state.users.push(action.payload);
        }
      }
    },
    getPhoto(state, action) {
      const { id, image, index } = action.payload;
      console.log("image uuuuuuuuuu", image);
      console.log("index uuuuuuuu", index);
      console.log("id uuuuuuuu", id);
      const userToUpdate = state.users.find((person) => person.personId === id);
console.log('userToUpdate uuuuuu',userToUpdate);
      if (userToUpdate) {
        return {
          ...state,
          users: state.users.map((user) =>
            user.personId === id
              ? { ...user, images: { ...user.images, [index]: image } }
              : user
          ),
        };
      } else {
        console.log("not userToUpdate!");
        return state;
      }
    },
    deletePhoto(state, action) {
      const { id, index } = action.payload;
      const userToUpdate = state.users.find((user) => user.personId === id);
      if (userToUpdate) {
        userToUpdate.images[index] = null;
      }
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice.reducer;

export const addPerson = (clientId, activePerson) => {
  return async (dispatch, getState) => {
    if (!clientId) {
      console.error("clientId is undefined");
      return;
    }

    const userStatus = activePerson ? activePerson.status : null;

    const db = getDatabase();

    if (userStatus === "unfinished") {
      alert(
        "У вас уже есть незавершенная личность. Завершите или удалите ее перед созданием новой."
      );
    } else {
      console.log("No active user found.");
      // Создать нового персонажа...
      const newPerson = {
        userId: clientId,
        status: "unfinished",
        timestamp: serverTimestamp(),
        isActive: false,
        images: [null, null, null, null],
        // по умолчанию персонаж неактивен
      };

      // Проверка, есть ли уже персонажи у данного пользователя
      const userPersons = getState().user.users.filter(
        (person) => person.userId === clientId
      );
     
      if (userPersons.length === 0) {
        // Если у пользователя еще нет персонажей, делаем эту комнату активной
        newPerson.isActive = true;
      }

      // Создайте нового персонажа в Firebase и получите уникальный ключ личности
      const newPersonRef = push(ref(db, "persons/"));
      // Добавьте уникальный ключ в объект newPerson
      newPerson.personId = newPersonRef.key;

      // Загрузите объект newPerson в Firebase
      await set(newPersonRef, newPerson);

      // Установить новый ключ персонажа как активный
      const userRef = ref(db, "users/" + clientId);
      await update(userRef, { activePersonId: newPerson.personId });

      dispatch(userAction.createPerson(newPerson));
      dispatch(userAction.setActivePersonId(newPerson.personId));
    }
  };
};

export const setActivePerson = (personId) => {
  return async (dispatch, getState) => {
    const db = getDatabase();
    const { users } = getState().user; // Получаем список персонажей из состояния

    // Обновляем данные в Firebase
    for (let person of users) {
      const roomRef = ref(db, "persons/" + person.personId);
      if (person.personId === personId) {
        await update(roomRef, { isActive: true });
      } else {
        await update(roomRef, { isActive: false });
      }
    }

    // Вызываем action для обновления состояния в Redux
    dispatch(userAction.toggleActiveRoom(personId));
  };
};

export const removePerson = (personId, clientId) => {
  return async (dispatch, getState) => {
    if (!personId) {
      console.error("personId is undefined");
      return;
    }

    const state = getState();
    const userPersons = state.user.users.filter(
      (person) => person.userId === clientId
    );

    // Найдем персонажа, которого собираемся удалить
    const deletedPerson = userPersons.find(
      (person) => person.personId === personId
    );

    const db = getDatabase();

    const personRef = ref(db, "persons/" + personId);
    await remove(personRef);

    dispatch(userAction.removePerson(personId));

    // Если удаляемый персонаж был активным
    if (deletedPerson && deletedPerson.isActive) {
      // Если у пользователя остались другие персонажи после удаления
      const remainingPersons = userPersons.filter(
        (person) => person.personId !== personId
      );
      if (remainingPersons.length > 0) {
        // Назначим первого из оставшихся персонажей   активным
        const newActivePerson = { ...remainingPersons[0], isActive: true };

        // Обновим данные этой персонажа в Firebase
        const newActivePersonRef = ref(
          db,
          "persons/" + newActivePerson.personId
        );
        await update(newActivePersonRef, newActivePerson);

        // Обновим состояние Redux
        dispatch(userAction.updatePersonData(newActivePerson));
      }
    }
    // Если удаляемый персонаж был действующим
    console.log('deletedPerson',deletedPerson.personId === state.activePersonId);
    console.log('stateactivePersonId',state.activePersonId);
    if (deletedPerson && deletedPerson.personId === state.user.activePersonId) {
      // Если у пользователя остались другие персонажи после удаления
      const remainingPersons = userPersons.filter(
        (person) => person.personId !== personId
      );
      if (remainingPersons.length > 0) {
        // Назначим первого из оставшихся персонажей   действующим
        const newActivePersonId = remainingPersons[0].personId;

        // Обновим данные  в Firebase
        const newActivePersonRef = ref(db, "users/" + clientId);
        await update(newActivePersonRef, {
          activePersonId:  newActivePersonId,
        });

        dispatch(userAction.setActivePersonId(newActivePersonId));
      }
    }
  };
};

export const updatePersonData = (personId, data) => {
  return async (dispatch) => {
    const db = getDatabase();

    // Получить ссылку на персонажа
    const personRef = ref(db, "persons/" + personId);

    // Обновить свойство 'name'
    await update(personRef, data);

    // Загрузить обновленные данные персонажа
    const snapshot = await get(personRef);
    const personData = snapshot.val();
    // Обновить состояние персонажа в Redux
    dispatch(userAction.updatePersonData(personData));
  };
};

export const loadAllUserPersons = (clientId) => {
  return async (dispatch) => {
    const db = getDatabase();

    // Получить ссылку на всех персонажей пользователя
    if (clientId) {
      const userPersonsRef = ref(db, "persons/");
      const filteredPersonsRef = query(
        userPersonsRef,
        orderByChild("userId"),
        equalTo(clientId)
      );
      const userPersonsSnapshot = await get(filteredPersonsRef);
      const userPersonsData = userPersonsSnapshot.val();
      const userRef = ref(db, "users/" + clientId);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData.activePersonId) {
        const activePersonId = userData.activePersonId;
        dispatch(userAction.setActivePersonId(activePersonId));
      }
      // Если есть данные, обновляем состояние Redux для каждого персонажа
      if (userPersonsData) {
        for (const personId in userPersonsData) {
          let personData = userPersonsData[personId];
          // Преобразование images в массив, если оно существует и является объектом
          if (personData.images && typeof personData.images === "object") {
            let imagesArray = Array(4).fill(null); // Массив из 4 элементов
            for (let key in personData.images) {
              imagesArray[key] = personData.images[key];
            }
            personData.images = imagesArray; // Обновление объекта personData
          }
          dispatch(userAction.addOrUpdatePerson(personData));
        }
      }
    } else {
      console.error("clientId is undefined");
    }
  };
};
