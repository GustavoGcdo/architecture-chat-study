/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./App.css";
import io, { Socket } from "socket.io-client";

type appMessage = {
  classList: "me" | "other";
  author: string;
  text: string;
};

type apiMessage = {
  text: string;
  user: { name: string; socketId: string };
};

type apiReturn = {
  data: apiMessage[];
  message: string;
};

function App() {
  const URL_API = "http://localhost:3333";
  const HEADER_DEFAULT = { "Content-type": "application/json" };
  const [socketId, setSocketId] = useState("");
  const [userName, setUserName] = useState("");
  const [userNameDisable, setUserNameDisable] = useState(false);
  const [messageBlocked, setMessageBlocked] = useState(true);
  const [messages, setMessages] = useState<appMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [userNameRef, setUserNameRef] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const newSocket = io(URL_API);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
      console.log("client connected");
    });

    newSocket.on("leave-chat", () => {
      console.log("leave");
      setMessageBlocked(true);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("enter-chat", (user) => {
        console.log("enter-chat");

        if (user.socketId === socket.id) {
          setMessageBlocked(false);
          getMessages();
        }
      });

      socket.on("message", (message) => {
        console.log("message");
        const messageMapped = mapMessage(message);
        addNewMessage(messageMapped);
      });
    }
  }, [socket]);

  const request = (uri: string, body: any, method = "POST") => {
    return fetch(`${URL_API}/${uri}`, {
      method: method,
      headers: HEADER_DEFAULT,
      body: JSON.stringify(body),
    });
  };

  const entrar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userNameRef) {
      setUserName(userNameRef.value);
      request("entrar", {
        name: userNameRef.value,
        socketId: socketId,
      }).then(() => {
        setUserNameDisable(true);
        setMessageBlocked(false);
      });
    }
  };

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      request("message", {
        text: currentMessage,
        userName,
      }).then(() => {
        setCurrentMessage("");
      });
  };

  const getMessages = () => {
    request("message", undefined, "GET")
      .then((data) => data.json())
      .then((responseMessages: apiReturn) => {
        for (const message of responseMessages.data) {
          const messageMapped = mapMessage(message);

          setMessages((oldMessages) => [...oldMessages, messageMapped]);
        }
      });
  };

  const mapMessage = (message: apiMessage): appMessage => {
    const { text, user } = message;

    const itsMe = user.name === userNameRef?.value;

    return {
      classList: itsMe ? "me" : "other",
      author: user.name,
      text,
    };
  };

  const addNewMessage = (message: appMessage) => {
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  return (
    <div className="main">
      <div>
        <form onSubmit={entrar} id="formEntrar">
          <input
            ref={(ref) => setUserNameRef(ref)}
            type="text"
            disabled={userNameDisable}
          />
          {!userNameDisable && <button>Entrar</button>}
        </form>
      </div>
      <div className={`chat-area ${messageBlocked && "blocked"}`}>
        <div className="messages">
          {messages.map((message, index) => (
            <div className={message.classList} key={index}>
              <span className="author">{message.author}</span>
              <span className="text">{message.text}</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={currentMessage}
          name="message"
          onChange={(e) => setCurrentMessage(e.target.value)}
          id="inputMessage"
          onKeyUp={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
