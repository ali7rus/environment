import { createSlice } from '@reduxjs/toolkit';
import { getDatabase, ref, push, set,remove,get, onValue,off} from "firebase/database";
// import log from 'loglevel';
// Начальное состояние slice
const initialState = {
    usersLikes: [],
};
// Создаем новый slice
const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: { addLike(state, action) {
    const newLike = action.payload;
    // Мы предполагаем, что action.payload содержит id лайка,
    // которое было сгенерировано при добавлении лайка в базу данных
    state.usersLikes.push(newLike);
    // state.isUserContentChanged = true;
  },
  removeLike(state, action) {
    const { userId, likedUserId } = action.payload;
    // Предполагается, что каждый лайк имеет уникальный id, который был сгенерирован при добавлении лайка в базу данных
    const index = state.usersLikes.findIndex(
      (like) => like.userId === likedUserId && like.likedByUserId === userId
    );
    if (index !== -1) {
      state.usersLikes.splice(index, 1);
    }
  },
  
  loadLikes(state, action) {
    state.usersLikes=action.payload;
  },
  },
});

// Экспортируем редукторы и селекторы
export const likesAction = likesSlice.actions;


 export default likesSlice.reducer; 

 export const getMutualLikes = (state, personId) => {
    const userLikes = state.likes.usersLikes.filter(
      (like) => like.userId === personId
    );
    //console.log("userLikes",userLikes);
    const likedUserIds = userLikes.map((like) => like.likedByUserId);
  
    const mutualLikes = state.likes.usersLikes.filter((like) => {
      return like.hasOwnProperty('likedByUserId') && likedUserIds.includes(like.userId) && like.likedByUserId === personId;
    });
    return mutualLikes;
  };
  
  export const getUserLikes = (state, personId) => {
    // Получаем лайки, которые поставил пользователь
    const userLikes = state.likes.usersLikes.filter((like) => 
    like.userId === personId);
    return userLikes;
  };

  export const getRoomLikes = (state, personId) => {
    // Получаем лайки, которые поставил пользователь
    const userLikes = state.likes.usersLikes.filter((like) => 
    like.userId === personId && like.hasOwnProperty('likedByRoomId') );
    return userLikes;
  };

  export const getUsersLikedByClient = (state, personId) => {
   
    const userLikes = state.likes.usersLikes.filter((like) => {
      return like.hasOwnProperty('likedByRoomId') && like.likedByRoomId === personId;
    });
   // console.log("userLikes",userLikes);

    const likedUserIds = userLikes.map((like) => like.userId);
  
   // console.log("likedUserIds",likedUserIds);
    const usersLikedByClient = state.likes.usersLikes.filter((like) =>
   
      likedUserIds.includes(like.userId)
    );
  // console.log("usersLikedByClient",usersLikedByClient);
    return usersLikedByClient;
  };
  

  export const addLike = (userId, likedUserId) => {
    return async (dispatch, getState) => {
      if (!userId || !likedUserId) {
        console.error("userId or likedUserId is undefined");
        return;
      }
  
      // Проверка существования лайка
      const existingLike = getState().likes.usersLikes.find(like => like.userId === userId && like.likedByUserId === likedUserId);
  
      if (existingLike) {
        console.error("Like already exists");
        return;
      }
  
      const newLike = {
        userId: userId,
        likedByUserId: likedUserId,
      };
  
      const db = getDatabase();
     
      const likeRef = push(ref(db, 'usersLikes')); 
      await set(likeRef, newLike);
      dispatch(likesAction.addLike({
        ...newLike,
        id: likeRef.key  // добавьте ключ записи в объект "лайка"
      }));
    };
  };
  
  export const addRoomLike = (userId, likedRoomId) => {
    return async (dispatch, getState) => {
      if (!userId || !likedRoomId) {
        console.error("userId or likedRoomId is undefined");
        return;
      }
  
      // Проверка существования лайка
      const existingLike = getState().likes.usersLikes.find(like => like.userId === userId && like.likedByRoomId === likedRoomId);
  
      if (existingLike) {
        console.error("Like already exists");
        return;
      }
  
      const newLike = {
        userId:userId ,
        likedByRoomId: likedRoomId,
      };
  
      const db = getDatabase();
     
      const likeRef = push(ref(db, 'usersLikes')); 
      await set(likeRef, newLike);
      dispatch(likesAction.addLike({
        ...newLike,
        id: likeRef.key  // добавьте ключ записи в объект "лайка"
      }));
    };
  };
  export const removeLike = (likeId) => {
    return async dispatch => {
      if (!likeId) {
        console.error("likeId is undefined");
        return;
      }
  
      const db = getDatabase();
     
      const likeRef = ref(db, 'usersLikes/' + likeId);
      await remove(likeRef); 

      dispatch(likesAction.removeLike(likeId));
    };
  };
  
  export const loadLikes = () => {
    return async dispatch => {
      const db = getDatabase();
      
      const likesSnapshot = await get(ref(db, 'usersLikes'));
      const likesObj = likesSnapshot.val() || {};
      // Преобразовать объект в массив
      const likesArray = Object.keys(likesObj).map(key => ({
        id: key,
        ...likesObj[key]
      }));
      dispatch(likesAction.loadLikes(likesArray));
    };
  };
  
  export const subscribeToUsersLikes = () => {
    return dispatch => {
      const db = getDatabase();
      const usersLikesRef = ref(db, 'usersLikes');
  
      const specificListener = onValue(usersLikesRef, (snapshot) => {
        const usersLikes = snapshot.val();
        
        // Если usersLikes не null и не undefined, преобразовываем его в массив
        if (usersLikes) {
          const likesArray = Object.keys(usersLikes).map(key => ({
            id: key,
            ...usersLikes[key]
          }));
      
          // Когда данные изменяются, обновляем состояние Redux
          dispatch(loadLikes(likesArray));
        }
      });
  
      // Возвращаем функцию для отписки
      return () => {
        off(usersLikesRef, specificListener);
      };
    };
  };
  
  