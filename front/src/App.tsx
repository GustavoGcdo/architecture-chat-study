import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

type appMessage = {
  classList: "me" | "other";
  author: string;
  text: string;
};

function App() {
  const URL_API = "http://localhost:3333";
  const HEADER_DEFAULT = { "Content-type": "application/json" };
  const socket = io(URL_API);
  const [userName, setUserName] = useState("");
  const [userNameDisable, setUserNameDisable] = useState(false);
  const [messageBlocked, setMessageBlocked] = useState(true);
  const [messages, setMessages] = useState<appMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("client connected");
    });

    socket.on("enter-chat", (user) => {
      if (user.socketId === socket.id) {
        console.log('enter-chat');
        
        setMessageBlocked(false);
        getMessages();
      }
    });

    socket.on("leave-chat", () => {
      console.log('leave');
      setMessageBlocked(true);
    });

    socket.on("message", (message) => {
      console.log("message");
      const messageMapped = mapMessage(message);
      addNewMessage(messageMapped);
    });
  }, []);

  const request = (uri: string, body: any, method = "POST") => {
    return fetch(`${URL_API}/${uri}`, {
      method: method,
      headers: HEADER_DEFAULT,
      body: JSON.stringify(body),
    });
  };

  const entrar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    request("entrar", {
      name: userName,
      socketId: socket.id,
    }).then(() => {
      setUserNameDisable(true);
      setMessageBlocked(false);
    });
  };

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      request("message", {
        text: currentMessage,
        username: userName,
      }).then(() => {
        setCurrentMessage("");
      });
  };

  const getMessages = () => {
    request("message", undefined, "GET")
      .then((data) => data.json())
      .then((responseMessages: any[]) => {
        const currentMessage: appMessage[] = [];
        
        for (const message of responseMessages) {
          const messageMapped = mapMessage(message);
          currentMessage.push(messageMapped);
        }

        setMessages(currentMessage);
      });
  };

  const mapMessage = (message: {
    text: string;
    user: { name: string };
  }): appMessage => {
    const { text, user } = message;
    const itsMe = user.name === userName;

    return {
      classList: itsMe ? "me" : "other",
      author: user.name,
      text,
    };
  };

  const addNewMessage = (message: appMessage) => {
    console.log([...messages, message]);
    
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  return (
    <div className="main">
      <div>
        <form onSubmit={entrar} id="formEntrar">
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value)}
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
