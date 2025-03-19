package com.mentorConnect.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mentorConnect.backend.entity.UserAndCourse;

@Repository
public interface UserAndCourseRepo extends MongoRepository<UserAndCourse,String> {

}
