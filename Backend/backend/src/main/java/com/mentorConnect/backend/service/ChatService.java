package com.mentorConnect.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mentorConnect.backend.entity.ChatMessage;
import com.mentorConnect.backend.repository.ChatRepo;

@Service
public class ChatService {
    @Autowired
    private ChatRepo chatRepo;
    
    public void saveMessage(ChatMessage message) {
        chatRepo.save(message);
    }

    public List<ChatMessage> getChatHistory(String chatRoomId) {
        return chatRepo.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
    }
}
