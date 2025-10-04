import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { Send, Trash2, MessageCircle } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser.js";
import api from "../lib/api.js";
import PageLoader from "../components/PageLoader.jsx";

const GlobalChatPage = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  // Fetch messages
  const {
    data: messagesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["globalChatMessages"],
    queryFn: async () => {
      const response = await api.get("/global-chat/messages");
      return response.data;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent) => {
      const response = await api.post("/global-chat/messages", {
        message: messageContent,
      });
      return response.data;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries(["globalChatMessages"]);
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const response = await api.delete(`/global-chat/messages/${messageId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["globalChatMessages"]);
    },
  });

  // Socket.io setup
  useEffect(() => {
    if (authUser) {
      // For fullstack deployment, connect to same origin (no separate backend URL needed)
      const socketURL = import.meta.env.DEV ? "http://localhost:5001" : window.location.origin;
      
      const newSocket = io(socketURL, {
        query: { userId: authUser._id },
      });

      setSocket(newSocket);

      // Join global chat room
      newSocket.emit("joinGlobalChat");

      // Listen for new messages
      newSocket.on("newGlobalMessage", (newMessage) => {
        queryClient.setQueryData(["globalChatMessages"], (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              messages: [...oldData.messages, newMessage],
            };
          }
          return oldData;
        });
      });

      // Listen for deleted messages
      newSocket.on("messageDeleted", ({ messageId }) => {
        queryClient.setQueryData(["globalChatMessages"], (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              messages: oldData.messages.filter((msg) => msg._id !== messageId),
            };
          }
          return oldData;
        });
      });

      // Listen for typing indicators
      newSocket.on("userTyping", ({ userId, username, isTyping }) => {
        if (userId !== authUser._id) {
          setIsTyping((prev) => ({
            ...prev,
            [userId]: isTyping ? username : null,
          }));
        }
      });

      return () => {
        newSocket.emit("leaveGlobalChat");
        newSocket.disconnect();
      };
    }
  }, [authUser, queryClient]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

  const handleSendMessage = () => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessageMutation.mutate(messageId);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (socket && authUser) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing
      socket.emit("typing", {
        userId: authUser._id,
        username: authUser.fullName,
        isTyping: true,
      });

      // Stop typing after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
          userId: authUser._id,
          username: authUser.fullName,
          isTyping: false,
        });
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-error">Failed to load messages</p>
          <button 
            className="btn btn-primary btn-sm mt-2"
            onClick={() => queryClient.invalidateQueries(["globalChatMessages"])}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const messages = messagesData?.messages || [];
  const typingUsers = Object.values(isTyping).filter(Boolean);

  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 p-4 border-b border-base-300 flex-shrink-0">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Global Chat Room</h1>
          <div className="badge badge-primary badge-sm">
            {messages.length} messages
          </div>
        </div>
        <p className="text-sm text-base-content/70 mt-1">
          Connect with language learners from around the world
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/70">No messages yet. Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${
                msg.sender._id === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={msg.sender.profilePic}
                    alt={msg.sender.fullName}
                  />
                </div>
              </div>
              <div className="chat-header">
                {msg.sender.fullName}
                <time className="text-xs opacity-50 ml-2">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </time>
              </div>
              <div className={`chat-bubble ${
                msg.sender._id === authUser._id ? "chat-bubble-primary" : ""
              } relative group`}>
                {msg.message}
                {msg.sender._id === authUser._id && (
                  <button
                    className="absolute -top-2 -right-2 btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteMessage(msg._id)}
                    disabled={deleteMessageMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-ghost">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm">
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} is typing...`
                    : `${typingUsers.length} people are typing...`}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-base-200 p-4 border-t border-base-300 flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="textarea textarea-bordered flex-1 resize-none"
            rows={1}
            maxLength={1000}
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="btn btn-primary btn-square"
          >
            {sendMessageMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="text-xs text-base-content/50 mt-1">
          Press Enter to send • Shift+Enter for new line • {message.length}/1000 characters
        </div>
      </div>
    </div>
  );
};

export default GlobalChatPage;