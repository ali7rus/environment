import { createSlice } from "@reduxjs/toolkit";
import {
  getDatabase,
  ref,
  onChildAdded,onChildChanged,
  set,
  remove,
  onValue,
  get,
  query,
  equalTo,
  orderByChild,
  serverTimestamp,
  update,
} from "firebase/database";

const initialState = {
  messages: [], // changed from array to object to map messages by chatId
  unreadCounts: {}, // object with count of unread messages for each partner
  partnerChat: null,
  personChats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      
      // Найти чат с заданным chatId
      const chat = state.messages.find((chat) => chat.chatId === chatId);
      
      if (chat) {
        // Если чат найден, добавляем сообщение
        chat.messages.push(message);
      } else {
        // Если чат не найден, создаем новый чат и добавляем сообщение
        state.messages.push({
          chatId: chatId,
          messages: [message],
        });
      }
    },
    addChat(state, action) {
      const chatId = action.payload;
      state.personChats.push(chatId);
      // increment unreadCount if message is from partner and partnerChat is not the same as chatId
    },
    deleteChat(state, action) {
      const chatId = action.payload;
      
      // Удаляем сообщения чата
      state.messages = state.messages.filter(chat => chat.chatId !== chatId);
      
      // Удаляем чат из списка чатов
      state.personChats = state.personChats.filter(id => id !== chatId);
    },
    loadChatsId(state, action) {
      const chatId = action.payload;
      state.personChats.push(chatId);
      // increment unreadCount if message is from partner and partnerChat is not the same as chatId
    },
    loadChats(state, action) {
      const chats = action.payload;
      state.messages = chats;
      // increment unreadCount if message is from partner and partnerChat is not the same as chatId
    },

   
    setPartnerChat(state, action) {
      state.partnerChat = action.payload;
      // reset unreadCount for this chatId
      state.unreadCounts[state.partnerChat] = 0;
    },
    closeChat(state) {
      state.partnerChat = null;
    },
  },
});

export const chatAction = chatSlice.actions;
export const { closeChat, markMessageAsRead, setPartnerChat } =
  chatSlice.actions;

export default chatSlice.reducer;

export const addMessage = (message, chatId) => {
  return async (dispatch, getState) => {
    const timestamp = Date.now();
    const { fromUserId, toUserId, clientId, partnerId } = message;

    console.log("chatId", chatId, message);
    if (!chatId) {
      console.error("userId or likedUserId is undefined");
      return;
    }

    const db = getDatabase();

    try {
      const chatSnapshot = await get(ref(db, `chats/${chatId}`));
      const chat = chatSnapshot.val();

      if (chat === null) {
        // Если чат не существует, создаем новый чат
        await set(ref(db, `chats/${chatId}`), {
          messages: {
            [timestamp]: message,
          },
        });

        // Обновляем информацию о чатах пользователя
        await update(ref(db, `personChats/${clientId}/${fromUserId}`), {
          [chatId]: true,
        });
        await update(ref(db, `personChats/${partnerId}/${toUserId}`), {
          [chatId]: true,
        });
        // Обновляем информацию о чатах в состоянии
        dispatch(chatAction.addChat(chatId));
      } else {
        // Если чат существует, добавляем новое сообщение
        await set(ref(db, `chats/${chatId}/messages/${timestamp}`), message);
      }

      console.log("Data has been successfully written to the database.");
    } catch (error) {
      console.error("Error updating Firebase:", error);
    }

    // Обновляем информацию о сообщениях в состоянии
   // dispatch(chatAction.addMessage({ message, chatId }));
  };
};

export const removeChat = (chatId, clientId,personId,partnerId,partnerPersonId) => {
  return async (dispatch, getState) => {
    const db = getDatabase();
console.log('clientId and partnerId chchchcccccc',clientId, partnerId);
    try {
      // Удаляем чат из Firebase
      await remove(ref(db, `chats/${chatId}`));

      // Удаляем чат из списка чатов пользователя в Firebase
      await remove(ref(db, `personChats/${clientId}/${personId}/${chatId}`));

      // Удаляем чат из списка чатов партнера в Firebase
      await remove(ref(db, `personChats/${partnerId}/${partnerPersonId}/${chatId}`));

      // Обновляем информацию о чатах в состоянии
      dispatch(chatAction.deleteChat(chatId));

      console.log("Chat has been successfully deleted from the database.");
    } catch (error) {
      console.error("Error deleting chat from Firebase:", error);
    }
  };
};
export const initializeChats = (clientId) => {
  return async (dispatch) => {
    const db = getDatabase();

    try {
      // Загружаем список чатов у пользователя
      const personSnapshot = await get(ref(db, `personChats/${clientId}`));
      const persons = personSnapshot.val();

      if (persons) {
        // Для каждой персоны загружаем ее чаты
        const chatPromises = Object.keys(persons).map(
          async (personId) => {
            const personChatsSnapshot = await get(
              ref(db, `personChats/${clientId}/${personId}`)
            );
            const personChats = personChatsSnapshot.val();

            // Загружаем детали каждого чата
            if (personChats) {
              const chatDetailPromises = Object.keys(personChats).map(
                async (chatId) => {
                  const chatRef = ref(db, `chats/${chatId}`);
                  const chatSnapshot = await get(chatRef);
                  const chat = chatSnapshot.val();

                  // Преобразуем сообщения чата в отсортированный массив
               if(chat){   const messages = chat.messages 
                  ? Object.values(chat.messages).sort((a, b) => a.timestamp - b.timestamp) 
                  : [];

                  return { chatId, messages };}
                }
              );

              // Use Promise.all to wait for all the promises to resolve
              const chats = await Promise.all(chatDetailPromises);
              return chats;
            } else {
              return [];
            }
          }
        );

        const allChats = (await Promise.all(chatPromises)).reduce((acc, val) => acc.concat(val), []);

        // Сортируем чаты по chatId
        allChats.sort((a, b) => a.chatId.localeCompare(b.chatId));

        // Обновляем информацию о чатах в состоянии
        dispatch(chatAction.loadChats(allChats));
      }

      console.log("Chats have been successfully loaded from the database.");
    } catch (error) {
      console.error("Error loading chats from Firebase:", error);
    }
  };
};

export const subscribeToNewMessages = (clientId) => {
  return (dispatch) => {
    const db = getDatabase();
    
    const personRef = ref(db, `personChats/${clientId}`);
    onChildAdded(personRef, async (personSnapshot) => {
      const personId = personSnapshot.key;
      const personChatsRef = ref(db, `personChats/${clientId}/${personId}`);
      
      onChildAdded(personChatsRef, async (chatSnapshot) => {
        const chatId = chatSnapshot.key;
        const chatMessagesRef = ref(db, `chats/${chatId}/messages`);
        
        onChildAdded(chatMessagesRef, (messageSnapshot) => {
          const newMessage = messageSnapshot.val();
          console.log(" newMessage iiiiiiiiiiiiiiiiii" ,newMessage );
          dispatch(chatAction.addMessage({ chatId, message: newMessage }));
        });
      });
    });
  };
};

