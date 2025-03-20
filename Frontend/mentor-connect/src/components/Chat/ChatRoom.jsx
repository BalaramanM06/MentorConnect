import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, User, MessageSquare } from "lucide-react";
import Chat from "./Chat";
import api from "../../utils/axiosConfig";
import ChatService from "../../utils/chatService";
import "./ChatRoom.css";
import defaultAvatar from "../../assets/default-profile.jpeg";

const ChatRoom = ({ initialSelectedMentor, currentUser: propCurrentUser }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [selectedReceiver, setSelectedReceiver] = useState(null);
    const [currentUser, setCurrentUser] = useState(propCurrentUser || null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableContacts, setAvailableContacts] = useState([]);

    // Initialize from location state if a mentor was selected
    useEffect(() => {
        if (location.state?.selectedMentor && currentUser) {
            // Find or create chat room with this mentor
            handleSelectContact({
                name: location.state.selectedMentor,
                email: location.state.selectedMentorEmail || `${location.state.selectedMentor.toLowerCase().replace(/\s+/g, '.')}@example.com`
            });
        } else if (initialSelectedMentor && currentUser) {
            // Use initialSelectedMentor if provided as a prop
            handleSelectContact(initialSelectedMentor);
        }
    }, [location.state, initialSelectedMentor, currentUser]);

    // Load current user (if not provided as prop) and chat rooms
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Get user role from token
                const userRole = getUserRoleFromToken(token);
                let userData = null;

                // Fetch current user if not provided as prop
                if (!propCurrentUser) {
                    try {
                        // Try to get user profile - this endpoint might not exist in the backend
                        const userResponse = await api.get("/auth/profile");
                        userData = userResponse.data;
                    } catch (userError) {
                        console.error("Error fetching user profile:", userError);

                        // Fallback: Create a user object from token information
                        const email = getUserEmailFromToken(token);
                        userData = {
                            email: email,
                            name: email.split('@')[0],
                            role: userRole
                        };
                    }

                    if (userData) {
                        setCurrentUser(userData);
                    } else {
                        throw new Error("Invalid user data response");
                    }
                } else {
                    userData = propCurrentUser;
                }

                // Fetch contacts based on user role
                try {
                    let contacts = [];
                    if (userRole === 'MENTOR') {
                        // Fetch all current students for this mentor
                        const studentsResponse = await api.get("/mentor/getAllCurrUser", {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (studentsResponse.data) {
                            contacts = studentsResponse.data.map(student => ({
                                email: student.email || student.userEmail,
                                name: student.name || student.userName || student.email.split('@')[0],
                                profilePic: student.profilePic || null
                            }));
                        }
                    } else {
                        // For students, we would fetch their mentors
                        // This API might not exist in the backend
                        try {
                            const mentorsResponse = await api.get("/api/student/mentors");
                            contacts = mentorsResponse.data || [];
                        } catch (error) {
                            console.error("Error fetching mentors:", error);
                            // Fallback: use mock mentors
                            contacts = generateMockMentors();
                        }
                    }

                    setAvailableContacts(contacts);

                    // Try to get chat rooms from backend
                    let roomsData = [];
                    try {
                        const chatsResponse = await ChatService.getChatRooms();
                        roomsData = chatsResponse;
                    } catch (error) {
                        console.error("Error fetching chat rooms:", error);

                        // Fallback: Generate chat rooms from contacts
                        roomsData = ChatService.generateMockChatRooms(userData, contacts);
                    }

                    setChatRooms(roomsData);
                    localStorage.setItem("chatRooms", JSON.stringify(roomsData));
                } catch (contactsError) {
                    console.error("Error fetching contacts:", contactsError);

                    // Fallback: check for cached rooms
                    const cachedRooms = localStorage.getItem("chatRooms");
                    if (cachedRooms) {
                        setChatRooms(JSON.parse(cachedRooms));
                    } else {
                        throw new Error("Failed to load chat rooms and contacts");
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load your chat rooms. Please try again later.");

                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, propCurrentUser]);

    // Helper function to extract user email from JWT token
    const getUserEmailFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            return payload.sub || payload.email || 'user@example.com';
        } catch (error) {
            console.error("Error decoding token:", error);
            return 'user@example.com';
        }
    };

    // Helper function to extract user role from JWT token
    const getUserRoleFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            return payload.role || 'STUDENT';
        } catch (error) {
            console.error("Error decoding token:", error);
            return 'STUDENT';
        }
    };

    // Generate mock mentors for fallback
    const generateMockMentors = () => {
        return [
            {
                email: 'john.smith@example.com',
                name: 'John Smith',
                profilePic: null
            },
            {
                email: 'sarah.wilson@example.com',
                name: 'Sarah Wilson',
                profilePic: null
            }
        ];
    };

    // Handle selecting a contact/chat room
    const handleSelectContact = async (contact) => {
        try {
            // If no current user yet, wait
            if (!currentUser) {
                setError("User profile not loaded yet. Please try again.");
                return;
            }

            // Check if a chat room already exists with this contact
            let chatRoom = chatRooms.find(room =>
                room.participants.some(p => p.email === contact.email)
            );

            // If not, create a new chat room
            if (!chatRoom) {
                try {
                    // Try to create a chat room via API
                    const response = await ChatService.createChatRoom([currentUser.email, contact.email]);
                    chatRoom = response;
                } catch (err) {
                    console.error("Error creating chat room via API:", err);

                    // Fallback: Create local chat room
                    const roomId = ChatService.generateChatRoomId(currentUser.email, contact.email);

                    chatRoom = {
                        id: roomId,
                        participants: [
                            {
                                email: currentUser.email,
                                name: currentUser.name,
                                profilePic: currentUser.profilePic
                            },
                            {
                                email: contact.email,
                                name: contact.name,
                                profilePic: contact.profilePic
                            }
                        ],
                        lastMessage: null,
                        unreadCount: 0
                    };

                    // Update local cache
                    const updatedRooms = [chatRoom, ...chatRooms];
                    setChatRooms(updatedRooms);
                    localStorage.setItem("chatRooms", JSON.stringify(updatedRooms));
                }
            }

            // Set the selected chat room and receiver
            setSelectedChatRoomId(chatRoom.id);

            // Find the receiver (the participant who is not the current user)
            const receiver = chatRoom.participants.find(p => p.email !== currentUser.email);
            setSelectedReceiver(receiver);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error selecting contact:", err);
            setError("Failed to start chat. Please try again.");
        }
    };

    // Filter chat rooms based on search term
    const filteredChatRooms = chatRooms.filter(room => {
        const otherParticipant = room.participants.find(p =>
            p.email !== (currentUser?.email || "")
        );

        return otherParticipant &&
            otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Handle back button from chat
    const handleBackFromChat = () => {
        setSelectedChatRoomId(null);
        setSelectedReceiver(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="chat-room-loading">
                <div className="spinner"></div>
                <p>Loading chats...</p>
            </div>
        );
    }

    return (
        <div className="chat-room-container">
            {error && (
                <div className="chat-error-banner">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {/* Sidebar with chat list */}
            <div className={`chat-sidebar ${selectedChatRoomId ? 'mobile-hidden' : ''}`}>
                <div className="chat-sidebar-header">
                    <h2>Messages</h2>
                    <div className="search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="chat-list">
                    {filteredChatRooms.length > 0 ? (
                        filteredChatRooms.map((room) => {
                            const otherParticipant = room.participants.find(
                                (p) => p.email !== (currentUser?.email || "")
                            );

                            if (!otherParticipant) return null;

                            return (
                                <div
                                    key={room.id}
                                    className={`chat-item ${selectedChatRoomId === room.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedChatRoomId(room.id);
                                        setSelectedReceiver(otherParticipant);
                                    }}
                                >
                                    <img
                                        src={otherParticipant.profilePic || defaultAvatar}
                                        alt={otherParticipant.name}
                                        className="chat-avatar"
                                    />
                                    <div className="chat-info">
                                        <h3>{otherParticipant.name}</h3>
                                        <p className="last-message">
                                            {room.lastMessage ?
                                                (room.lastMessage.length > 30 ?
                                                    `${room.lastMessage.substring(0, 30)}...` :
                                                    room.lastMessage) :
                                                'No messages yet'}
                                        </p>
                                    </div>
                                    {room.unreadCount > 0 && (
                                        <div className="unread-badge">{room.unreadCount}</div>
                                    )}
                                </div>
                            );
                        })
                    ) : searchTerm ? (
                        <div className="no-results">No contacts match your search</div>
                    ) : (
                        <div className="no-chats">
                            <MessageSquare size={48} className="no-chats-icon" />
                            <p>No conversations yet</p>
                            <p className="no-chats-sub">Start chatting with a mentor or student</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat area */}
            <div className={`chat-area ${!selectedChatRoomId ? 'mobile-hidden' : ''}`}>
                {selectedChatRoomId && currentUser && selectedReceiver ? (
                    <Chat
                        chatRoomId={selectedChatRoomId}
                        currentUser={currentUser}
                        receiver={selectedReceiver}
                        onBack={handleBackFromChat}
                    />
                ) : (
                    <div className="no-chat-selected">
                        <User size={64} className="no-chat-icon" />
                        <h3>Select a conversation</h3>
                        <p>Choose a contact from the list to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatRoom; 