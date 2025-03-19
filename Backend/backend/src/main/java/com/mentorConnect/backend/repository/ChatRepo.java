package com.mentorConnect.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mentorConnect.backend.entity.ChatMessage;

@Repository
public interface ChatRepo extends MongoRepository<ChatMessage,String> {
    List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(String chatRoomId);

}
