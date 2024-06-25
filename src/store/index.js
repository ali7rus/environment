import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice"; 
import mainSlice from "./main-slice";
import likesSlice from "./likes-slice";
import roomSlice from "./room-slice";
import usersSlice from "./users-slice";
import roomsSlice from "./rooms-slice";
import chatSlice from "./chat-slice";
  
  const store = configureStore({
    reducer: {
      user: userSlice,
      main: mainSlice,
      likes:likesSlice,
      room:roomSlice,
      rooms:roomsSlice,
      users: usersSlice,
      chat:chatSlice,
    },
  });
  export default store;