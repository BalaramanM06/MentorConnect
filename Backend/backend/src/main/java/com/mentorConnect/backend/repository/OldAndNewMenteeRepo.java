package com.mentorConnect.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mentorConnect.backend.entity.OldAndNewMentee;

@Repository
public interface OldAndNewMenteeRepo extends MongoRepository<OldAndNewMentee, String> {

    public OldAndNewMentee findByMentorEmail(String mentorEmail);

}
