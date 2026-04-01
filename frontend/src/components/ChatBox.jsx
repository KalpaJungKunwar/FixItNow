import { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

const BASE_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const getToken = () => localStorage.getItem("token");

export default function ChatBox({ requestId, currentUser }) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // ── Fetch history on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/messages?filters[service_request][documentId][$eq]=${requestId}&populate[sender]=true&sort=createdAt:asc&pagination[limit]=100`,
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
        const data = await res.json();
        const history = (data.data || []).map((m) => ({
          senderId: m.sender?.id, // will now be populated
          senderName: m.sender_name,
          message: m.msg,
          timestamp: m.createdAt,
        }));
        setMessages(history);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchHistory();
  }, [requestId]);

  // ── Socket listeners ────────────────────────────────────────────────
  useEffect(() => {
    const socket = socketRef.current;
    socket.emit("join_room", requestId);

    const handleMessage = (msg) => {
      // Only add message if it belongs to this room
      if (msg.requestId === requestId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.emit("leave_room", requestId); 
    };
  }, [requestId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current.emit("send_message", {
      requestId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      message: input.trim(),
    });
    setInput("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-80">
      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-8">
            No messages yet. Say hello! 👋
          </p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  isMe ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-semibold mb-1 text-gray-500">
                    {msg.senderName}
                  </p>
                )}
                <p>{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
