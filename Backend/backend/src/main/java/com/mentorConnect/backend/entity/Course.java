package com.mentorConnect.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "course")
public class Course {

    @Id
    private String id;
    private String courseName;
    private String description;
    private byte[] image;
}
