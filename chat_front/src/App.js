import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [socketId, setSocketId] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [admin, setAdmin] = useState(false);

  const joinPrivateChat = async () => {
    if (username !== "") {
      let data = await socket.emit("join_private_chat");
      //console.log(data.id);
      setSocketId(data.id);
      setShowChat(true);
    }
  };

  const joinAsAdmin = () => {
    socket.emit("join_admin_chat");
    setShowChat(true);
    setAdmin(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Private Chat</h3>
          <input
            type="text"
            placeholder="Your Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />

          <button onClick={joinPrivateChat}>Join Private Chat</button>
          <h1>OR</h1>
          <button onClick={joinAsAdmin}>Join as Admin </button>
        </div>
      ) : (
        <Chat
          socket={socket}
          username={username}
          userId={socketId}
          admin={admin}
        />
      )}
    </div>
  );
}

export default App;
