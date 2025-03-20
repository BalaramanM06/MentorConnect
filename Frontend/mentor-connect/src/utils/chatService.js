import api from './axiosConfig';

/**
 * Chat service for handling chat-related API calls
 */
const ChatService = {
    /**
     * Get chat history for a specific chat room
     * @param {string} chatRoomId - The chat room ID
     * @returns {Promise<Array>} - Chat history
     */
    getChatHistory: async (chatRoomId) => {
        try {
            // Use the actual endpoint from the backend (ChatController.java)
            const response = await api.get(`/history/${chatRoomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    /**
     * Get all chat rooms for the current user
     * @returns {Promise<Array>} - List of chat rooms
     */
    getChatRooms: async () => {
        try {
            // This endpoint doesn't exist in the backend, so we'll need to adapt
            // We'll create a fallback mechanism in case the API isn't available
            const response = await api.get('/api/chat/rooms');
            return response.data;
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
            throw error;
        }
    },

    /**
     * Create a new chat room
     * @param {Array} participants - Array of participant emails
     * @returns {Promise<Object>} - Created chat room
     */
    createChatRoom: async (participants) => {
        try {
            // This endpoint doesn't exist in the backend, so we'll need to adapt
            const response = await api.post('/api/chat/room', { participants });
            return response.data;
        } catch (error) {
            console.error('Error creating chat room:', error);
            throw error;
        }
    },

    /**
     * Save a chat message to local storage (fallback mechanism)
     * @param {string} roomId - Chat room ID
     * @param {Array} messages - List of messages
     */
    saveMessagesToLocalStorage: (roomId, messages) => {
        try {
            localStorage.setItem(`chatMessages_${roomId}`, JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving messages to local storage:', error);
        }
    },

    /**
     * Get chat messages from local storage (fallback mechanism)
     * @param {string} roomId - Chat room ID
     * @returns {Array} - List of messages or empty array if none found
     */
    getMessagesFromLocalStorage: (roomId) => {
        try {
            const messages = localStorage.getItem(`chatMessages_${roomId}`);
            return messages ? JSON.parse(messages) : [];
        } catch (error) {
            console.error('Error retrieving messages from local storage:', error);
            return [];
        }
    },

    /**
     * Generate chat room ID for two users (for local fallback mechanism)
     * @param {string} user1 - First user email
     * @param {string} user2 - Second user email
     * @returns {string} - Chat room ID
     */
    generateChatRoomId: (user1, user2) => {
        // Sort emails to ensure the same ID regardless of order
        const participants = [user1, user2].sort();
        return `room_${participants.join('_')}`;
    },

    /**
     * Generate mock data for chat rooms (fallback mechanism)
     * @param {Object} currentUser - Current user object
     * @param {Array} contacts - List of contacts
     * @returns {Array} - List of mock chat rooms
     */
    generateMockChatRooms: (currentUser, contacts) => {
        return contacts.map(contact => {
            const chatRoomId = ChatService.generateChatRoomId(currentUser.email, contact.email);
            const messages = ChatService.getMessagesFromLocalStorage(chatRoomId);

            return {
                id: chatRoomId,
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
                lastMessage: messages.length > 0 ? messages[messages.length - 1].content : null,
                unreadCount: 0,
                timestamp: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date().toISOString()
            };
        });
    }
};

export default ChatService; 