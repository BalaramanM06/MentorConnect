package com.mentorConnect.backend.entity;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAndCourse {

    @Id
    private String id;
    private User user;
    private Course course;
}
