package com.mentorConnect.backend.filter;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mentorConnect.backend.entity.ChatMessage;
import com.mentorConnect.backend.service.ChatService;


@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    @Autowired
    private ChatService chatService;

    private static final Map<String, Map<String, WebSocketSession>> chatSessions= new HashMap<>() ;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String chatRoomId = extractChatRoomId(session);
        String userEmail = extractUserEmail(session);

        chatSessions.putIfAbsent(chatRoomId, new HashMap<>());
        chatSessions.get(chatRoomId).put(userEmail, session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ChatMessage chatMessage = objectMapper.readValue(message.getPayload(), ChatMessage.class);

        // Save message to MongoDB
        chatService.saveMessage(chatMessage);

        // Broadcast the message to both mentor and mentee
        Map<String, WebSocketSession> chatRoom = chatSessions.get(chatMessage.getChatRoomId());
        if (chatRoom != null) {
            for (WebSocketSession s : chatRoom.values()) {
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage(objectMapper.writeValueAsString(chatMessage)));
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        chatSessions.values().forEach(room -> room.values().remove(session));
    }

    private String extractChatRoomId(WebSocketSession session) {
        return session.getUri().getQuery().split("=")[1]; 
    }

    private String extractUserEmail(WebSocketSession session) {
        return session.getUri().getQuery().split("=")[2]; 
    }
}
