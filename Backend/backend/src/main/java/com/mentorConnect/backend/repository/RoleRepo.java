package com.mentorConnect.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mentorConnect.backend.entity.Role;

public interface RoleRepo extends MongoRepository<Role,String> {

}
