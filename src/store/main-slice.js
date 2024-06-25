import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statusMessage: null,
  city:'Москва',
};

const mainCartSlise = createSlice({
  name: "main",
  initialState: initialState,
  reducers: {
    setCity(state,action){
state.city=action.payload;
    },
    showStatusBarMessage(state, action) {
      state.statusMessage={
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      }
    },
  },
});
export default mainCartSlise.reducer;
export const mainActions = mainCartSlise.actions;
