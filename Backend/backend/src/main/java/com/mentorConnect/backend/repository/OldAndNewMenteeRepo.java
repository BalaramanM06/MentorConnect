package com.mentorConnect.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mentorConnect.backend.entity.OldAndNewMentee;

public interface OldAndNewMenteeRepo extends MongoRepository<OldAndNewMentee, String> {

    public OldAndNewMentee findByMentorEmail(String mentorEmail);

}
