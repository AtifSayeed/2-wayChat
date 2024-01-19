import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, userId, admin }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendPrivateMessage = async () => {
    if (currentMessage !== "") {
      if (admin) {
        const messageData = {
          userId: "user1",
          author: username,
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        console.log(messageData);
        await socket.emit("send_private_message_admin", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      } else {
        const messageData = {
          userId: userId,
          author: username,
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        console.log(messageData);
        await socket.emit("send_private_message_user", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }
    }
  };

  useEffect(() => {
    const receivePrivateMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    // Attach the event listener
    socket.on("receive_private_message", receivePrivateMessage);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("receive_private_message", receivePrivateMessage);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Private Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type your message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendPrivateMessage();
          }}
        />
        <button onClick={sendPrivateMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
