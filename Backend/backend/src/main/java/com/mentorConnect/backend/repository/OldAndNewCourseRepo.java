package com.mentorConnect.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mentorConnect.backend.entity.OldAndNewCourse;

public interface OldAndNewCourseRepo extends MongoRepository<OldAndNewCourse,String> {
    
    public OldAndNewCourse findByMenteeEmail(String menteeEmail);
}
