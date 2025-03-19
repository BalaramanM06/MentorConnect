package com.mentorConnect.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mentorConnect.backend.entity.Course;

@Repository
public interface CourseRepo extends MongoRepository<Course, String> {
    public Course findByCourseName(String courseName);

}
