import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import socket from "../../sockets";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./ChatComponent.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavDropdownExample from "../UI/Nav";
 import { addLike } from "../../store/likes-slice";

function Reception({ partner }) {
  console.log("chat component");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { user } = useAuth0();
  const clientId = user?.sub.split("|")[1];
 

  const dispatch = useDispatch();

  const messageIds = useRef(new Set());
  console.log(messages);

  useEffect(() => {
    socket.emit("register", clientId); // Зарегистрируйте пользователя при подключении
  });

  useEffect(() => {
    fetch(
      `https://progect-joke-default-rtdb.firebaseio.com/chats/${generateChatId(
        clientId,
        partner.id
      )}/messages.json`
    )
      .then((response) => response.json())
      .then((data) => {
        const messages = Object.entries(data || {})
          .map(([timestamp, msg]) => ({
            ...msg,
            timestamp: Number(timestamp),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        console.log(data);

        messages.forEach((msg) => messageIds.current.add(msg.timestamp));

        setMessages(messages);
      });



    const receiveMessageHandler = (message) => {
      if (
        message.fromUserId === partner.id &&
        message.toUserId === clientId &&
        !messageIds.current.has(message.timestamp)
      ) {
        if (message.deleted) {
          // Обработка удаленного сообщения
          setMessages([]);
          setMessage(""); // Очистить текст сообщения
        } else {
          messageIds.current.add(message.timestamp);
          setMessages((oldMessages) => [...oldMessages, message]);
        }
      }
    };
    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [clientId, partner.id]);

  const sendMessage = (text) => {
    console.log("socket connected:", socket.connected); // add this
    const message = {
      toUserId: partner.id,
      fromUserId: clientId,
      text,
      timestamp: Date.now(), // Добавьте timestamp здесь
    };

    // Добавить сообщение в состояние сразу после его отправки
    messageIds.current.add(message.timestamp);
    setMessages((oldMessages) => [...oldMessages, message]);

    socket.emit("send_message", message);
  };

  const onInputChange = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

 const handleButtonClick = () => {
    // Вызывает обе функции
     deleteChat();
    // onDislike();
  };

  const deleteChat = () => {
    const chatId = generateChatId(clientId, partner.id);
    fetch(`https://progect-joke-default-rtdb.firebaseio.com/chats/${chatId}.json`, {
      method: "DELETE"
    })
      .then(() => {
        // Очистите сообщения и выполните дополнительные действия, если необходимо
        setMessages([]);
        // Закройте окно подтверждения удаления
        setShowDeleteConfirmation(false);
  
        // Очистите текст сообщения
        setMessage("");
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
  };

  const sendMessageHandler = useCallback(
    (event) => {
      event.preventDefault();
      sendMessage(message);
      setMessage(""); // Очищение поля ввода после отправки
      if (clientId && partner.id) {
        dispatch(addLike(clientId,partner.id));
      }
    },
    [message, clientId,partner.id]
  );
  return (
    <div className={styles.chatContainer}>
      {showDeleteConfirmation ? (
        <div className={styles.deleteConfirmation}>
          <p>Are you sure you want to delete the chat with {partner.name}?</p>
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
            onDeliteLikeUser={handleButtonClick }
            onSetShowDelete={() => setShowDeleteConfirmation(true)}
          />
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.fromUserId === clientId
                    ? styles.messageClient
                    : styles.messagePartner
                }
              >
                <div className={styles.message}>
                  {message.fromUserId !== clientId && (
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

export default Reception;

function generateChatId(userId1, userId2) {
  // Убедимся, что меньший ID всегда идет первым
  if (userId1 < userId2) {
    return userId1 + "-" + userId2;
  } else {
    return userId2 + "-" + userId1;
  }
}
