import styles from "./FavoriteUser.module.css";
import { useDispatch, useSelector } from "react-redux";
import { removeLike, getUserLikes } from "../../../store/likes-slice";
import { userAction } from "../../../store/user-slice";
import { useClientData } from "../../../store/hook";
import ChatComponent from "../ChatComponent";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../../sockets";
import { setPartnerChat } from "../../../store/chat-slice";
import { useUsersArray } from "../../../store/hooks";


const FavoriteUsers = () => {
  console.log("FavoriteUsers");
  const [partner, setPartner] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  const { personId } = useParams();
  const usersArray = useUsersArray(personId);

  const dispatch = useDispatch();

  const messages = useSelector((state) => state.chat.messages);
  

  const [lastMessages, setLastMessages] = useState([]);

  const [usersWithoutChat, setUsersWithoutChat] = useState([]);
  const [usersWithLastMessage, setUsersWithLastMessage] = useState([]);

  const { clientId } = useClientData();


  const partnerData = useSelector((state) => state.chat.partnerChat);

  useEffect(() => {
    // Update the partner state using the retrieved partner data
    setPartner(partnerData);
  }, [partnerData]);

  const mutualMyLikesData = useSelector((state) =>
    getUserLikes(state, personId)
  );

  useEffect(() => {
    // Код для выполнения при монтировании компонента

  dispatch(userAction.setChatId(personId))
    return () => {
      // Код для выполнения при размонтировании компонента
      dispatch(userAction.setChatId(null))  
      dispatch(setPartnerChat(null)); 
    };
  }, []);


  const dislikeHandler = () => {
    if (partner.likeId) {
      console.log("dislikeHandler partner");
      dispatch(removeLike(partner.likeId));
      // Get current state
      const myLike = mutualMyLikesData.find(
        (data) => data.likedByUserId === (partner.personId )
      );
      if (myLike) {
console.log("dislikeHandler my");
        dispatch(removeLike(myLike.id));
      }
    }
    setPartner(null);
  };

  const chatHandler = (user) => {
    socket.emit("join_user", personId);
    if (partner !== user) {
      dispatch(setPartnerChat(user));
    }
    // Обновляем непрочитанные сообщения, удаляя идентификатор пользователя
    setUnreadMessages((prevState) => {
      const updatedState = { ...prevState };
      delete updatedState[user.personId];
      
      // Сохраняем обновленное состояние в localStorage
      localStorage.setItem("unreadMessages", JSON.stringify(updatedState));
      
      return updatedState;
    });
  };

  useEffect(() => {
    // Восстанавливаем непрочитанные сообщения из localStorage
    const savedUnreadMessages = localStorage.getItem("unreadMessages");
    if (savedUnreadMessages) {
      setUnreadMessages(JSON.parse(savedUnreadMessages));
    }
  
    const handleNewMessage = (newMessage) => {
      const { fromUserId } = newMessage;
  
      if (fromUserId !== partner?.personId) {
        setUnreadMessages((prevState) => {
          const updatedState = {
            ...prevState,
            [fromUserId]: prevState[fromUserId] ? prevState[fromUserId] + 1 : 1,
          };
  
          // Сохраняем новое состояние в localStorage
          localStorage.setItem("unreadMessages", JSON.stringify(updatedState));
  
          return updatedState;
        });
      }
    };
  
    // Подписываемся на событие
    socket.on('new_message', handleNewMessage);
  
    // Возвращаем функцию отписки, которая будет вызвана при размонтировании компонента
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [partner?.personId]); 

  // Обновите функцию getLastMessage
  const getLastMessage = (partnerId) => {
    const chatId = generateChatId(personId, partnerId);

    const chat = messages.find((chat) => chat.chatId === chatId);

    const sortedMessages = [...(chat?.messages || [])].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    const lastMessage = sortedMessages[0];

    if (lastMessage) {
      return { ...lastMessage, partnerId };
    }
  };

  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const lastMessages = await Promise.all(
          usersArray.map(async (partner) => {
            const message = await getLastMessage(partner.personId);
            if (message) {
              return { ...message, partnerId: partner.personId };
            } else {
              return null; // верните null вместо undefined
            }
          })
        );

        const validLastMessages = lastMessages.filter(
          (message) => message !== null
        ); // отфильтруйте null

        setLastMessages(validLastMessages);

        const usersWithoutMessage = usersArray.filter(
          (user) =>
            !validLastMessages.some(
              (msg) => msg && msg.partnerId === user.personId
            )
        );

        const usersWithMessage = usersArray.filter((user) =>
          validLastMessages.some(
            (msg) => msg && msg.partnerId === user.personId
          )
        );

        setUsersWithLastMessage(usersWithMessage);
        setUsersWithoutChat(usersWithoutMessage);
      } catch (error) {
        console.error("Error fetching last messages:", error);
      }
    };
    fetchLastMessages();

    socket.on("send_message", (message) => {
      setLastMessages((prevState) => [...prevState, message]);
      const partnerId = message.senderId;
      if (usersWithoutChat.some((user) => user.personId === partnerId)) {
        setUsersWithoutChat((prevState) =>
          prevState.filter((user) => user.personId !== partnerId)
        );
        setUsersWithLastMessage((prevState) => [
          ...prevState,
          usersWithoutChat.find((user) => user.personId === partnerId),
        ]);
      }
    });

    return () => {
      socket.off("send_message");
    };
  }, [messages]);

  return (
    <>
      <div className={styles.card}>
        {partner ? (
          <ChatComponent
            partner={partner}
            personId={personId}
            clientId={clientId}
            onDislike={dislikeHandler}
          />
        ) : (
          <>
            <h3>Users without chat:</h3>
            <ul className={styles.listFavoriteUsers}>
              {usersWithoutChat.map((user) => (
                <li
                  onClick={() => chatHandler(user)}
                  className={styles.content}
                  key={user.personId }
                >
                  <img
                    src={
                      user.images?.find((image) => !!image) ||
                      "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                    }
                    alt={user.name}
                    className={styles.userImage}
                  />
                  <p>{user.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <h3>Users with last message:</h3>
              {usersWithLastMessage.map((user) => (
                <div
                  onClick={() => chatHandler(user)}
                  className={styles.contentChat}
                  key={user.personId || user.roomId}
                >
                  <img
                    src={
                      user.images?.find((image) => !!image) ||
                      "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                    }
                    alt={user.name}
                    className={styles.userImageChat}
                  />
                  <div className={styles.messageContainer}>
                    {lastMessages.map((msg) => {
                      if (msg.partnerId === user.personId) {
                        return (
                          <div key={msg.timestamp}>
                            <h4>{user.name}</h4>
                            <p>{msg.text}</p>
                            {unreadMessages[user.personId] > 0 && (
                              <span>
                                {unreadMessages[user.personId]} непрочитанных
                                сообщений
                              </span>
                            )}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default FavoriteUsers;

function generateChatId(userId1, userId2) {
  // Убедимся, что меньший ID всегда идет первым
  if (userId1 < userId2) {
    return userId1 + "-" + userId2;
  } else {
    return userId2 + "-" + userId1;
  }
}
// {/* <a
//       ref={linkRef}
//       href={`tg://resolve?domain=${props.nikName || ""}`}
//       style={{ display: "none" }}
//     >
//       Отправить сообщение
//     </a> */}
