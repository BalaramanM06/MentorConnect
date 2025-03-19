package com.mentorConnect.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mentorConnect.backend.entity.OldAndNewCourse;
import com.mentorConnect.backend.entity.OldAndNewMentee;
import com.mentorConnect.backend.entity.User;
import com.mentorConnect.backend.entity.UserAndCourse;
import com.mentorConnect.backend.repository.OldAndNewCourseRepo;
import com.mentorConnect.backend.repository.OldAndNewMenteeRepo;
import com.mentorConnect.backend.repository.UserAndCourseRepo;
import com.mentorConnect.backend.repository.UserRepo;

@Service
public class MenteeService {

    @Autowired 
    private UserRepo userRepo;

    @Autowired
    private OldAndNewMenteeRepo oldAndNewMenteeRepo;

    @Autowired
    private OldAndNewCourseRepo oldAndNewCourseRepo;

    @Autowired
    private UserAndCourseRepo userAndCourseRepo;

    public List<UserAndCourse> getOldCourse(String email){
        OldAndNewCourse oldAndNewCourse=oldAndNewCourseRepo.findByMenteeEmail(email);
        if(oldAndNewCourse==null) return new ArrayList<>();
        return oldAndNewCourse.getOldCourse();
    }

    public List<UserAndCourse> getNewCourse(String email){
        OldAndNewCourse oldAndNewCourse=oldAndNewCourseRepo.findByMenteeEmail(email);
        if(oldAndNewCourse==null) return new ArrayList<>();
        return oldAndNewCourse.getNewCourse();
    }

    public List<UserAndCourse> getPendingRequest(String email){
        OldAndNewCourse oldAndNewCourse=oldAndNewCourseRepo.findByMenteeEmail(email);
        if(oldAndNewCourse==null) return new ArrayList<>();
        return oldAndNewCourse.getPendingRequest();
    }

    public OldAndNewCourse getMenteeCourseDetail(String email){
        return oldAndNewCourseRepo.findByMenteeEmail(email);
    }

    public List<UserAndCourse> getAllCourse(){
        return userAndCourseRepo.findAll();
    }

    public void addRequest(String menteeEmail,UserAndCourse userAndCourse){
        User user=userAndCourse.getUser();
        OldAndNewCourse oldAndNewCourse = oldAndNewCourseRepo.findByMenteeEmail(menteeEmail);
        if(oldAndNewCourse==null) oldAndNewCourse=new OldAndNewCourse();
        List<UserAndCourse> pending=oldAndNewCourse.getPendingRequest();
        if(pending==null) pending=new ArrayList<>();
        pending.add(userAndCourse);
        oldAndNewCourseRepo.save(oldAndNewCourse);

        Optional<User> mentee1= userRepo.findByEmail(menteeEmail);
        User mentee=mentee1.get();

        OldAndNewMentee oldAndNewMentee =oldAndNewMenteeRepo.findByMentorEmail(user.getEmail());
        if(oldAndNewMentee==null) oldAndNewMentee=new OldAndNewMentee();
        if(oldAndNewMentee.getPendingRequest()==null) oldAndNewMentee.setPendingRequest(new ArrayList<>());
        UserAndCourse userAndCourse2=new UserAndCourse();
        userAndCourse2.setCourse(userAndCourse.getCourse());
        userAndCourse2.setUser(mentee);
        oldAndNewMentee.getPendingRequest().add(userAndCourse2);
        oldAndNewMenteeRepo.save(oldAndNewMentee);
    }

    




}
