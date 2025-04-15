import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://message-backend-a06d.onrender.com");

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState(null); // No sender initially

  const loginUser = (username) => {
    setSender(username);
  };

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.length > 0 && sender) {
      socket.emit("sendMessage", message, sender);
      setMessage("");
    }
  };

  if (!sender) {
    return (
      <div className="flex  items-center justify-center w-screen h-screen bg-red-200">
        <div className="h-[300px] w-[400px] text-center bg-red-100 rounded-lg shadow-md p-5">
          <h1 className="text-3xl text-gray-700">
            Please login to send messages
          </h1>
          <div className="flex flex-col items-center justify-center h-full">
            <button
              className="w-42 rounded bg-blue-200 p-2 text-xl text-gray-700 mb-2"
              onClick={() => loginUser("User1")}
            >
              Login as User1
            </button>
            <button
              className="w-42 rounded bg-blue-200 p-2 text-xl text-gray-700 mb-2"
              onClick={() => loginUser("User2")}
            >
              Login as User2
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-red-200">
      <div className="h-[550px] w-[500px] bg-white rounded-lg shadow-md">
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-center justify-center bg-red-500 h-[80px] rounded-t-lg">
            <h1 className="text-3xl text-gray-300">Message</h1>
          </div>
          <div className="flex flex-col items-center justify-center bg-red-100 h-[600px]   overflow-y-auto">
            {messages.length === 0 ? (
              <h1 className="text-2xl text-gray-400 ">No messages yet</h1>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`w-[80%]  my-2 p-2 rounded-lg ${
                    msg.sender === sender ? "bg-red-300" : "bg-blue-300"
                  }`}
                >
                  <h1 className="text-xl text-gray-700">{msg.message}</h1>
                  <h2 className="text-sm text-gray-500">{msg.sender}</h2>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-center w-full px-5 py-2 bg-red-400 h-[70px]">
            <input
              className="w-full h-full bg-red-300 p-2 rounded outline-none text-xl"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              className="bg-red-500 text-white p-2 rounded-lg ml-2"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
