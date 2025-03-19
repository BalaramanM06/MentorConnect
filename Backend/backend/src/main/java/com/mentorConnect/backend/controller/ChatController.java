package com.mentorConnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.mentorConnect.backend.entity.ChatMessage;
import com.mentorConnect.backend.service.ChatService;

@RestController
public class ChatController {
    @Autowired
    private ChatService chatService;

    @GetMapping("/history/{chatRoomId}")
    public List<ChatMessage> getChatHistory(@PathVariable String chatRoomId) {
        return chatService.getChatHistory(chatRoomId);
    }
}
