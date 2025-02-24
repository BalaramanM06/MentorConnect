package com.mentorConnect.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mentorConnect.backend.entity.User;

public interface UserRepo extends MongoRepository<User,String>{

    Optional<User> findByEmail(String email);

}
