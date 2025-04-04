package com.mentorConnect.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection =  "userAndCourse")
public class UserAndCourse {

    @Id
    private String id;
    private User user;
    private Course course;
}
