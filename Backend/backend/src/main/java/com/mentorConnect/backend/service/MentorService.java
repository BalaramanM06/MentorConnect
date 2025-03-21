package com.mentorConnect.backend.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mentorConnect.backend.entity.Course;
import com.mentorConnect.backend.entity.OldAndNewCourse;
import com.mentorConnect.backend.entity.OldAndNewMentee;
import com.mentorConnect.backend.entity.User;
import com.mentorConnect.backend.entity.UserAndCourse;
import com.mentorConnect.backend.repository.CourseRepo;
import com.mentorConnect.backend.repository.OldAndNewCourseRepo;
import com.mentorConnect.backend.repository.OldAndNewMenteeRepo;
import com.mentorConnect.backend.repository.UserAndCourseRepo;
import com.mentorConnect.backend.repository.UserRepo;
import com.mentorConnect.backend.security.JwtUtil;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MentorService {

    @Autowired
    private CourseRepo courseRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private OldAndNewMenteeRepo oldAndNewMenteeRepo;

    @Autowired
    private OldAndNewCourseRepo oldAndNewCourseRepo;

    @Autowired
    private UserAndCourseRepo userAndCourseRepo;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<?> validateCertificate(
            MultipartFile certificate,
            String mentorName,
            String courseName,
            String token,
            String description) {
        if (certificate.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "No certificate file provided"));
        }
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Decode the token to get email
        String email = jwtUtil.extractEmail(token);

        try {
            // Save file temporarily for Tesseract processing
            // Path tempFile = Files.createTempFile("certificate", ".png");
            // Files.copy(certificate.getInputStream(), tempFile,
            // StandardCopyOption.REPLACE_EXISTING);

            // // Extract text from the image
            // String extractedText = extractTextFromImage(tempFile.toFile());

            // // Delete the temporary file
            // Files.delete(tempFile);

            // Validate extracted text
            Map<String, Object> validationResult = new HashMap<>();
            Optional<User> user = userRepo.findByEmail(email);
            if (user.isPresent()) {
                User u = user.get();
                Course c = new Course();
                c.setCourseName(courseName);
                c.setDescription(description);
                c.setImage(certificate.getBytes());

                // Save Course first
                c = courseRepo.save(c); // Ensure Course gets an ID before referencing it

                if (u.getCourses() == null) {
                    u.setCourses(new ArrayList<>());
                }
                u.getCourses().add(c);
                userRepo.save(u); // Save User after updating courses list

                // Create UserAndCourse reference
                UserAndCourse userAndCourse = new UserAndCourse();
                userAndCourse.setCourse(c);
                userAndCourse.setUser(u);

                userAndCourseRepo.save(userAndCourse); // Save UserAndCourse after setting Course
            }

            return ResponseEntity.ok(validationResult);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error processing certificate: " + e.getMessage()));
        }
    }

    private String extractTextFromImage(File imageFile) throws TesseractException {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath("/usr/share/tesseract/tessdata");
        tesseract.setLanguage("eng");
        // Use English OCR
        return tesseract.doOCR(imageFile);
    }

    private Map<String, Object> validateCertificateText(String text, String mentorName, String courseName) {
        Map<String, Object> result = new HashMap<>();

        List<String> foundDates = extractAllPossibleDates(text);
        boolean mentorFound = fuzzyMatch(text, mentorName);
        boolean courseFound = fuzzyMatch(text, courseName);

        List<String> errors = new ArrayList<>();
        if (foundDates.isEmpty())
            errors.add("No valid date found in certificate.");
        if (!mentorFound)
            errors.add("Mentor name not found in certificate.");
        if (!courseFound)
            errors.add("Course name not found in certificate.");

        result.put("status", errors.isEmpty() ? "valid" : "invalid");
        result.put("message", errors.isEmpty() ? "Certificate is valid." : String.join(" ", errors));
        result.put("datesFound", foundDates);
        result.put("extractedText", text);

        return result;
    }

    private List<String> extractAllPossibleDates(String text) {
        List<String> foundDates = new ArrayList<>();
        List<Pattern> datePatterns = Arrays.asList(
                Pattern.compile("\\b\\d{1,2}[/]\\d{1,2}[/]\\d{2,4}\\b"),
                Pattern.compile("\\b\\d{1,2}-\\d{1,2}-\\d{2,4}\\b"),
                Pattern.compile(
                        "\\b(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|Sept|September|Oct|October|Nov|November|Dec|December)\\s+\\d{1,2},\\s+\\d{4}\\b",
                        Pattern.CASE_INSENSITIVE),
                Pattern.compile(
                        "\\b\\d{1,2}\\s+(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|Sept|September|Oct|October|Nov|November|Dec|December)\\s+\\d{4}\\b",
                        Pattern.CASE_INSENSITIVE),
                Pattern.compile("\\b\\d{4}-\\d{1,2}-\\d{1,2}\\b"));

        for (Pattern pattern : datePatterns) {
            Matcher matcher = pattern.matcher(text);
            while (matcher.find()) {
                String dateMatch = matcher.group();
                if (!foundDates.contains(dateMatch)) {
                    foundDates.add(dateMatch);
                }
            }
        }

        return foundDates;
    }

    private boolean fuzzyMatch(String text, String targetValue) {
        String normalizedText = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ");
        String normalizedTarget = targetValue.toLowerCase().replaceAll("[^a-z0-9\\s]", " ");

        if (normalizedText.contains(normalizedTarget)) {
            return true;
        }

        LevenshteinDistance ld = new LevenshteinDistance();
        String[] words = normalizedText.split("\\s+");
        String[] targetWords = normalizedTarget.split("\\s+");
        int targetWordCount = targetWords.length;

        for (int i = 0; i <= words.length - targetWordCount; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < targetWordCount; j++) {
                sb.append(words[i + j]).append(" ");
            }
            String ngram = sb.toString().trim();
            int distance = ld.apply(normalizedTarget, ngram);
            if (distance <= 3) {
                return true;
            }
        }
        return false;
    }

    public List<UserAndCourse> getAllPastUser(String email) {
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(email);
        if (oldAndNewMentee == null) {
            return new ArrayList<>();
        }
        List<UserAndCourse> oldMentee = oldAndNewMentee.getOldMentee();
        if (oldMentee.isEmpty()) {
            return new ArrayList<>();
        }
        return oldMentee;
    }

    public List<UserAndCourse> getAllCurrUser(String email) {
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(email);
        if (oldAndNewMentee == null) {
            return new ArrayList<>();
        }
        List<UserAndCourse> newMentee = oldAndNewMentee.getNewMentee();
        if (newMentee.isEmpty()) {
            return new ArrayList<>();
        }
        return newMentee;
    }

    public OldAndNewMentee getAllStudent(String email) {
        return oldAndNewMenteeRepo.findByMentorEmail(email);
    }

    public ResponseEntity<?> addMentee(String mentorEmail, String menteeEmail, Course course) {
        Optional<User> mentor = userRepo.findByEmail(mentorEmail);
        Optional<User> mentee = userRepo.findByEmail(menteeEmail);
        if (mentor.isEmpty() || mentee.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor or Mentee not found"));
        }
        User n = mentee.get();
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(mentorEmail);
        if (oldAndNewMentee == null) {
            oldAndNewMentee = new OldAndNewMentee();
            oldAndNewMentee.setMentorEmail(mentorEmail);
        }
        List<UserAndCourse> newMentee = oldAndNewMentee.getNewMentee();
        UserAndCourse userAndCourse = new UserAndCourse();
        userAndCourse.setUser(n);
        userAndCourse.setCourse(course);
        newMentee.add(userAndCourse);
        oldAndNewMentee.setNewMentee(newMentee);
        oldAndNewMenteeRepo.save(oldAndNewMentee);
        return ResponseEntity.ok(Collections.singletonMap("message", "Mentee added successfully"));
    }

    public ResponseEntity<?> removeAndToPast(String mentorEmail, String menteeEmail, String courseName) {
        Optional<User> mentor = userRepo.findByEmail(mentorEmail);
        Optional<User> mentee = userRepo.findByEmail(menteeEmail);
        if (mentor.isEmpty() || mentee.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor or Mentee not found"));
        }
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(mentorEmail);
        OldAndNewCourse oldAndNewCourse = oldAndNewCourseRepo.findByMenteeEmail(menteeEmail);

        if (oldAndNewMentee == null || oldAndNewCourse == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor not found"));
        }
        UserAndCourse userAndCourse = new UserAndCourse();
        UserAndCourse userAndCourse1 = new UserAndCourse();
        List<UserAndCourse> newMentee = oldAndNewMentee.getNewMentee();
        List<UserAndCourse> newCourse = oldAndNewCourse.getNewCourse();
        for (UserAndCourse uac : newMentee) {
            if (uac.getUser().getEmail().equals(menteeEmail) && uac.getCourse().getCourseName().equals(courseName)) {
                newMentee.remove(uac);
                userAndCourse = uac;
                break;
            }
        }
        for (UserAndCourse uac : newCourse) {
            if (uac.getUser().getEmail().equals(mentorEmail) && uac.getCourse().getCourseName().equals(courseName)) {
                newCourse.remove(uac);
                userAndCourse1 = uac;
                break;
            }
        }

        if (userAndCourse.getUser() == null || userAndCourse1.getUser() == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentee not found"));
        }
        List<UserAndCourse> oldCourse = oldAndNewCourse.getOldCourse();
        oldCourse.add(userAndCourse1);
        oldAndNewCourse.setOldCourse(oldCourse);
        oldAndNewCourse.setNewCourse(newCourse);
        oldAndNewCourseRepo.save(oldAndNewCourse);
        List<UserAndCourse> oldMentee = oldAndNewMentee.getOldMentee();
        oldMentee.add(userAndCourse);
        oldAndNewMentee.setOldMentee(oldMentee);
        oldAndNewMentee.setNewMentee(newMentee);
        oldAndNewMenteeRepo.save(oldAndNewMentee);
        return ResponseEntity.ok(Collections.singletonMap("message", "Mentee moved to past successfully"));
    }

    public ResponseEntity<?> removeFromPast(String mentorEmail, String menteeEmail, String courseName) {
        Optional<User> mentor = userRepo.findByEmail(mentorEmail);
        Optional<User> mentee = userRepo.findByEmail(menteeEmail);
        if (mentor.isEmpty() || mentee.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor or Mentee not found"));
        }
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(mentorEmail);
        if (oldAndNewMentee == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor not found"));
        }
        UserAndCourse userAndCourse = new UserAndCourse();
        List<UserAndCourse> oldMentee = oldAndNewMentee.getOldMentee();
        for (UserAndCourse uac : oldMentee) {
            if (uac.getUser().getEmail().equals(menteeEmail) && uac.getCourse().getCourseName().equals(courseName)) {
                oldMentee.remove(uac);
                userAndCourse = uac;
                break;
            }
        }
        if (userAndCourse.getUser() == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentee not found"));
        }
        oldAndNewMentee.setOldMentee(oldMentee);
        oldAndNewMenteeRepo.save(oldAndNewMentee);
        return ResponseEntity.ok(Collections.singletonMap("message", "Mentee removed from past successfully"));
    }

    public ResponseEntity<?> handleCourseRequest(String mentorEmail, String menteeEmail, String courseName,
            String status) {
        Optional<User> mentor = userRepo.findByEmail(mentorEmail);
        Optional<User> mentee = userRepo.findByEmail(menteeEmail);
        if (mentor.isEmpty() || mentee.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor or Mentee not found"));
        }
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(mentorEmail);
        OldAndNewCourse oldAndNewCourse = oldAndNewCourseRepo.findByMenteeEmail(menteeEmail);

        if (oldAndNewMentee == null || oldAndNewCourse == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentor not found"));
        }
        UserAndCourse userAndCourse = new UserAndCourse();
        UserAndCourse userAndCourse2 = new UserAndCourse();
        List<UserAndCourse> pendingRequest = oldAndNewMentee.getPendingRequest();
        List<UserAndCourse> pendingRequest2 = oldAndNewCourse.getPendingRequest();
        for (UserAndCourse uac : pendingRequest) {
            if (uac.getUser().getEmail().equals(menteeEmail) && uac.getCourse().getCourseName().equals(courseName)) {
                pendingRequest.remove(uac);
                userAndCourse = uac;
                break;
            }
        }
        for (UserAndCourse uac : pendingRequest2) {
            if (uac.getUser().getEmail().equals(mentorEmail) && uac.getCourse().getCourseName().equals(courseName)) {
                pendingRequest2.remove(uac);
                userAndCourse2 = uac;
                break;
            }
        }
        if (userAndCourse.getUser() == null || userAndCourse2.getUser() == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Mentee not found"));
        }
        List<UserAndCourse> newMentee = oldAndNewMentee.getNewMentee();
        List<UserAndCourse> newCourse = oldAndNewCourse.getNewCourse();
        if (status.equals("accept")) {
            newMentee.add(userAndCourse);
            newCourse.add(userAndCourse2);
        }
        oldAndNewCourse.setNewCourse(newCourse);
        oldAndNewCourse.setPendingRequest(pendingRequest2);
        oldAndNewCourseRepo.save(oldAndNewCourse);
        oldAndNewMentee.setNewMentee(newMentee);
        oldAndNewMentee.setPendingRequest(pendingRequest);
        oldAndNewMenteeRepo.save(oldAndNewMentee);
        return ResponseEntity.ok(Collections.singletonMap("message", "Course request handled successfully"));
    }

    public List<UserAndCourse> getAllPendingRequest(String email) {
        OldAndNewMentee oldAndNewMentee = oldAndNewMenteeRepo.findByMentorEmail(email);
        if (oldAndNewMentee == null) {
            return new ArrayList<>();
        }
        List<UserAndCourse> pendingRequest = oldAndNewMentee.getPendingRequest();
        if (pendingRequest.isEmpty()) {
            return new ArrayList<>();
        }
        return pendingRequest;
    }

    public ResponseEntity<?> addFreeTime(List<Date> date, String email) {
        Optional<User> user = userRepo.findByEmail(email);
        User u = null;
        if (user.isPresent()) {
            u = user.get();
        } else {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email not Exist"));
        }
        Set<Date> set = u.getFreetime();
        set.addAll(date);
        u.setFreetime(set);
        userRepo.save(u);
        return ResponseEntity.ok(Collections.singletonMap("message", "Free Time Added successfully"));
    }

    public ResponseEntity<?> deleteFreeTime(List<Date> date, String email) {
        Optional<User> user = userRepo.findByEmail(email);
        User u = null;
        if (user.isPresent()) {
            u = user.get();
        } else {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email not Exist"));
        }
        Set<Date> set = u.getFreetime();
        set.removeAll(date);
        u.setFreetime(set);
        userRepo.save(u);
        return ResponseEntity.ok(Collections.singletonMap("message", "Free Time Added successfully"));
    }
}