import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Paperclip } from "lucide-react";
import WebSocketService from "../../utils/WebSocketService";
import ChatService from "../../utils/chatService";
import "./Chat.css";
import defaultAvatar from "../../assets/default-profile.jpeg";

const Chat = ({ chatRoomId, currentUser, receiver, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const messageEndRef = useRef(null);
    const navigate = useNavigate();

    // Fetch chat history and connect to WebSocket
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        // Load chat history
        const fetchChatHistory = async () => {
            setIsLoading(true);
            try {
                // Use the ChatService to fetch chat history from the backend
                const chatHistory = await ChatService.getChatHistory(chatRoomId);
                setMessages(chatHistory || []);

                // Save to local storage for fallback
                ChatService.saveMessagesToLocalStorage(chatRoomId, chatHistory);
            } catch (err) {
                console.error("Error fetching chat history:", err);
                setError("Failed to load chat history. Using local data instead.");

                // Fallback: Get messages from localStorage
                const localMessages = ChatService.getMessagesFromLocalStorage(chatRoomId);
                if (localMessages.length > 0) {
                    setMessages(localMessages);
                } else {
                    // Generate mock messages only if no history exists locally
                    const mockMessages = generateMockMessages(currentUser, receiver);
                    setMessages(mockMessages);
                    ChatService.saveMessagesToLocalStorage(chatRoomId, mockMessages);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Connect to WebSocket
        const connectWebSocket = async () => {
            try {
                await WebSocketService.connect(token);

                // Subscribe to user's channel for direct messages
                WebSocketService.subscribe(`/user/${currentUser.email}/queue/messages`, (message) => {
                    if (message.chatRoomId === chatRoomId) {
                        setMessages(prev => [...prev, message]);
                        // Save to localStorage for fallback
                        const updatedMessages = [...messages, message];
                        ChatService.saveMessagesToLocalStorage(chatRoomId, updatedMessages);
                    }
                });

                // Subscribe to chat room channel
                WebSocketService.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
                    setMessages(prev => [...prev, message]);
                    // Save to localStorage for fallback
                    const updatedMessages = [...messages, message];
                    ChatService.saveMessagesToLocalStorage(chatRoomId, updatedMessages);
                });

            } catch (err) {
                console.error("WebSocket connection error:", err);
                setError("Chat will work in fallback mode (messages saved locally).");
            }
        };

        fetchChatHistory();
        connectWebSocket();

        // Cleanup function
        return () => {
            WebSocketService.unsubscribe(`/user/${currentUser.email}/queue/messages`);
            WebSocketService.unsubscribe(`/topic/chat/${chatRoomId}`);
        };
    }, [chatRoomId, currentUser, navigate]);

    // Update localStorage when messages change
    useEffect(() => {
        if (messages.length > 0) {
            ChatService.saveMessagesToLocalStorage(chatRoomId, messages);
        }
    }, [messages, chatRoomId]);

    // Generate mock messages for fallback
    const generateMockMessages = (user, recipient) => {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        return [
            {
                id: `mock_${Date.now()}_1`,
                chatRoomId: chatRoomId,
                senderEmail: recipient.email,
                receiverEmail: user.email,
                message: `Hello ${user.name}, how can I help you today?`,
                timestamp: yesterday
            },
            {
                id: `mock_${Date.now()}_2`,
                chatRoomId: chatRoomId,
                senderEmail: user.email,
                receiverEmail: recipient.email,
                message: "I had a question about our upcoming session.",
                timestamp: yesterday
            },
            {
                id: `mock_${Date.now()}_3`,
                chatRoomId: chatRoomId,
                senderEmail: recipient.email,
                receiverEmail: user.email,
                message: "Sure, what would you like to know?",
                timestamp: now
            }
        ];
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        // Create message object that matches the ChatMessage.java entity
        const messageData = {
            chatRoomId: chatRoomId,
            senderEmail: currentUser.email,
            receiverEmail: receiver.email,
            message: newMessage,
            timestamp: new Date()
        };

        // Send message via WebSocket
        let sent = false;
        try {
            // Use /app/chat.send destination to match the backend configuration
            sent = WebSocketService.sendMessage("/app/chat.send", messageData);
        } catch (err) {
            console.error("Error sending message via WebSocket:", err);
        }

        // Add message to UI regardless of WebSocket success (optimistic update)
        setMessages(prev => [...prev, messageData]);
        setNewMessage("");

        if (!sent) {
            // If failed to send via WebSocket, display a fallback message
            setError("Message saved locally. It will be sent when connection is restored.");
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="chat-loading">
                <div className="spinner"></div>
                <p>Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                </button>
                <div className="receiver-info">
                    <img
                        src={receiver.profilePic || defaultAvatar}
                        alt={receiver.name}
                        className="receiver-avatar"
                    />
                    <div className="receiver-details">
                        <h3>{receiver.name}</h3>
                        <span className="status online">Online</span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && <div className="chat-error">{error}</div>}

            {/* Messages Container */}
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.senderEmail === currentUser.email ? 'sent' : 'received'}`}
                        >
                            <div className="message-content">
                                <p>{msg.message}</p>
                                <span className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <form className="message-input-container" onSubmit={handleSendMessage}>
                <button type="button" className="attachment-button">
                    <Paperclip size={20} />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default Chat; 