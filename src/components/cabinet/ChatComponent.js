import React, { useEffect, useState, useRef, useCallback } from "react";
import { addMessage,removeChat} from "../../store/chat-slice";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../sockets";
import styles from "./ChatComponent.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDropdownExample from "../UI/Nav";

function ChatComponent({ partner, personId, clientId, onDislike }) {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const chatId = generateChatId(personId, partner.personId );
  const dispatch = useDispatch();

  // Функция обработки события "leave_user"
  const handleLeaveUser = () => {
    socket.emit("leave_user", personId);
    console.log(`User left userId: ${personId}`);
  };

  const messageIds = useRef(new Set());

  const lastMessageTimestamp = useRef(0);

  const messagesChat = useSelector((state) => {
    const chat = state.chat.messages.find((chat) => chat.chatId === chatId);
    return chat?.messages || [];
  });
  
  console.log("messagesChat chatcomponent",messagesChat);
  useEffect(() => {
    console.log("useEffect base chat");

    const sortedMessages = [...messagesChat].sort((a, b) => b.timestamp - a.timestamp);
    setMessages(sortedMessages);

    const receiveMessageHandler = (message) => {
      if (
        message.fromUserId === (partner.personId ) &&
        message.toUserId === personId &&
        !messageIds.current.has(message.timestamp)
      ) {
        if (message.deleted) {
          // Обработка удаленного сообщения
          setMessages([]);
          setMessage(""); // Очистить текст сообщения
        } else {
          messageIds.current.add(message.timestamp);
    
          // Обновляем сортировку сообщений после добавления нового
          setMessages((oldMessages) => {
            const newMessages = [...oldMessages, message];
            return newMessages.sort((a, b) => b.timestamp - a.timestamp);
          });
    
          lastMessageTimestamp.current = message.timestamp;
        }
      }
    };
    
    socket.on("receive_message", receiveMessageHandler, (error) => {
      if (error) {
        console.error("Receive message error:", error);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server rrrrrrrr", reason);
    });

    socket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect to server rrrrrrr");
  });

    socket.on("reconnect", () => {
      console.log("Reconnected to server rrrrrrr");
      setTimeout(() => {
        socket.emit("register", personId); // Регистрируем пользователя на сервере
        socket.emit("join_user", personId); // Присоединяемся к комнате
      }, 1000);
    });
    return () => {
      socket.off("receive_message", receiveMessageHandler);
      socket.off("reconnect");
    };
  }, [chatId]); // Добавляем messagesChat в зависимости useEffect

  const sendMessage = (text) => {
    console.log("socket connected:", socket.connected);
    const newMessage = {
      toUserId: partner.personId,
      fromUserId: personId,
      text,
      timestamp: Date.now(),
      partnerId: partner.userId,
      clientId: clientId,
    };
  
    // Добавить сообщение в состояние сразу после его отправки
    messageIds.current.add(newMessage.timestamp);
  
    // Обновляем сортировку сообщений после добавления нового
    setMessages((oldMessages) => {
      const newMessages = [...oldMessages, newMessage];
      return newMessages.sort((a, b) => b.timestamp - a.timestamp);
    });
  
    dispatch(addMessage(newMessage, chatId));
  
    socket.emit("send_message", newMessage, (error) => {
      if (error) {
        // Обрабатываем ошибку здесь
        console.error("Send message error:", error);
      }
    });
  };


  const onInputChange = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleButtonClick = async () => {
    // Вызывает обе функции
    await deleteChat();
    onDislike();
  };

  const deleteChat = () => {
    dispatch(removeChat(chatId, clientId,personId,partner.userId,partner.personId));
        // Очистите сообщения и выполните дополнительные действия, если необходимо
        setMessages([]);
        // Закройте окно подтверждения удаления
        setShowDeleteConfirmation(false);
        // Очистите текст сообщения
        setMessage("");
   
  };

  const sendMessageHandler = useCallback(
    (event) => {
      event.preventDefault();
      sendMessage(message);
      setMessage(""); // Очищение поля ввода после отправки
    },
    [message]
  );
  return (
    <div className={styles.chatContainer}>
      {showDeleteConfirmation ? (
        <div className={styles.deleteConfirmation}>
          <p>
            Are you sure you want to delete the chat with{" "}
            {partner.name || partner.street}?
          </p>
          <Button variant="danger" size="sm" onClick={deleteChat}>
            Delete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <NavDropdownExample
            image={
              partner.images?.find((image) => !!image) ||
              "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
            }
            className={styles.NavDropdownExample}
            onDeliteLikeUser={handleButtonClick}
            onSetShowDelete={() => setShowDeleteConfirmation(true)}
            onLeaveUser={handleLeaveUser}
          />
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.fromUserId === personId
                    ? styles.messageClient
                    : styles.messagePartner
                }
              >
                <div className={styles.message}>
                  {message.fromUserId !== personId && (
                    <img
                      className={styles.userImage}
                      src={
                        partner.images?.find((image) => !!image) ||
                        "https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"
                      }
                      alt=""
                    />
                  )}
                  <p>{message.text || "No message text"}</p>
                </div>
                <p>{new Date(message.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <Form className={styles.cardButton} onSubmit={sendMessageHandler}>
            <Form.Control
              value={message}
              onChange={onInputChange}
              placeholder="Введите текст..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <Button
              type="submit"
              variant="outline-secondary"
              id="button-addon2"
            >
              Send
            </Button>
          </Form>
        </>
      )}
    </div>
  );
}

export default ChatComponent;

function generateChatId(userId1, userId2) {
  // Убедимся, что меньший ID всегда идет первым
  if (userId1 < userId2) {
    return userId1 + "-" + userId2;
  } else {
    return userId2 + "-" + userId1;
  }
}
