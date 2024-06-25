import { createSlice } from "@reduxjs/toolkit";
import {
  getDatabase,onValue,off,
  ref,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";

const initialState = {
  users: [],
  persons:[],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsers(state, action) {
      state.users = action.payload;
    },
    updatePersons(state, action) {
      state.persons = action.payload;
    },
  },
});

export const usersAction = usersSlice.actions;

export default usersSlice.reducer;

let usersListener = null;
let personsListener = null;

export const subscribeToUsersData = () => {
  return async (dispatch) => {
    const db = getDatabase();
    const usersRef = ref(db, "persons/");
    const finishedPersonsRef = query(usersRef, orderByChild('status'), equalTo('finished'));
   personsListener = onValue(finishedPersonsRef, (snapshot) => {
      const personsData = snapshot.val();

      if (personsData) {
        const personsArray = Object.values(personsData);
        dispatch(usersAction.updatePersons(personsArray));
      }
    });

   
    const activePersonsRef = query(usersRef, orderByChild('isActive'), equalTo(true));

    usersListener = onValue(activePersonsRef, (snapshot) => {
      const usersData = snapshot.val();

      // Обновляем состояние Redux при каждом изменении данных
      if (usersData) {
        const dataArray = Object.values(usersData);

        dispatch(usersAction.updateUsers(dataArray));
        // Используйте personsData и usersData по вашему усмотрению
        // Например, можно сравнить их или взаимодействовать с ними в других частях кода
      }
    });
  };
};

export const unsubscribeFromUsersData = () => {
  return async (dispatch) => {
    const db = getDatabase();
    const usersRef = ref(db, "persons/");
    
    // Отменяем подписку на изменения данных
    if (usersListener && personsListener ) {
      off(usersRef, "value", usersListener);
      off(usersRef, "value", personsListener);
      usersListener = null;
      personsListener = null;
    }
  };
};
