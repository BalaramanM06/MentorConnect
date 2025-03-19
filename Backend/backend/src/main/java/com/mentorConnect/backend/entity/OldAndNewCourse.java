package com.mentorConnect.backend.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "oldAndNewCourse")
public class OldAndNewCourse {
    @Id
    private String id;
    private String menteeEmail;
    private List<UserAndCourse> oldCourse;
    private List<UserAndCourse> newCourse;
    private List<UserAndCourse> pendingRequest;
}
