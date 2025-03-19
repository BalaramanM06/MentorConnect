package com.mentorConnect.backend.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Document(collection = "message")
public class ChatMessage {
    @Id
    private String id;
    private String chatRoomId;
    private String senderEmail;
    private String receiverEmail;
    private String message;
    private Date timestamp;

    public ChatMessage() {
        this.timestamp = new Date();
    }

    public ChatMessage(String chatRoomId, String senderEmail, String receiverEmail, String message) {
        this.chatRoomId = chatRoomId;
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.message = message;
        this.timestamp = new Date();
    }
}
