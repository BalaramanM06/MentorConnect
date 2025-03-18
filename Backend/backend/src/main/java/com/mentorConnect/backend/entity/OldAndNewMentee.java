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
@Document(collection = "oldAndNewMentee")
public class OldAndNewMentee {
    @Id
    private String id;
    private String mentorEmail;
    private List<UserAndCourse> oldMentee;
    private List<UserAndCourse> newMentee;
    private List<UserAndCourse> pendingRequest;
}
