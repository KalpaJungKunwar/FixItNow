import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

const BASE_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const getToken = () => localStorage.getItem("token");

export default function ChatBox({ requestId, currentUser }) {
  const socketRef = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const bottomRef = useRef(null);

  const markMessagesAsRead = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/messages?filters[service_request][documentId][$eq]=${requestId}&filters[sender][id][$ne]=${currentUser.id}&filters[read][$eq]=false&fields[0]=id&fields[1]=documentId&pagination[limit]=100`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const data = await res.json();
      const unread = data.data || [];

      await Promise.all(
        unread.map((msg) =>
          fetch(`${BASE_URL}/api/messages/${msg.documentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ data: { read: true } }),
          }),
        ),
      );
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  }, [requestId, currentUser.id]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setFetchError(false);
        const res = await fetch(
          `${BASE_URL}/api/messages?filters[service_request][documentId][$eq]=${requestId}&populate[sender]=true&sort=createdAt:asc&pagination[limit]=100`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          },
        );
        const data = await res.json();

        const history = (data.data || []).map((m) => ({
          id: m.id,
          documentId: m.documentId,
          senderId: m.sender?.id,
          senderName: m.sender_name || m.sender?.username,
          message: m.msg || m.message,
          timestamp: m.createdAt,
        }));

        setMessages(history);
        await markMessagesAsRead();
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
        setFetchError(true);
      }
    };

    if (requestId) {
      fetchHistory();
    }
  }, [requestId, markMessagesAsRead]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join_room", requestId);

    const handleMessage = (msg) => {
      if (msg.requestId !== requestId) return;
      if (msg.senderId === currentUser.id) return;
      setMessages((prev) => [...prev, msg]);
      markMessagesAsRead();
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.emit("leave_room", requestId);
    };
  }, [requestId, socketRef, currentUser.id, markMessagesAsRead]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      console.warn("Socket not connected");
      return;
    }

    const newMessage = {
      requestId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      message: input.trim(),
      id: `local-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  function formatDateLabel(date) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = d.toDateString() === today.toDateString();
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return d.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-80">
      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {fetchError && (
          <p className="text-xs text-red-400 text-center mt-8">
            Failed to load messages. Please try again.
          </p>
        )}

        {!fetchError && messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-8">
            No messages yet. Say hello! 👋
          </p>
        )}

        {messages.reduce((acc, msg, i) => {
          const msgDate = new Date(msg.timestamp).toDateString();
          const prevDate =
            i > 0 ? new Date(messages[i - 1].timestamp).toDateString() : null;

          const showDate = msgDate !== prevDate;

          if (showDate) {
            acc.push(
              <div key={`date-${i}`} className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDateLabel(msg.timestamp)}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>,
            );
          }

          const isMe = msg.senderId === currentUser.id;

          acc.push(
            <div
              key={msg.id}
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
                  className={`text-xs mt-1 ${
                    isMe ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>,
          );

          return acc;
        }, [])}

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
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
