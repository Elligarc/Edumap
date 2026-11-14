package com.roadmap.common.seed.data;

import com.roadmap.common.seed.RoadmapDataSeeder;
import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.comments.domain.repository.CommentRepository;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollment;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollmentId;
import com.roadmap.modules.progress.domain.repository.UserRoadmapEnrollmentRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@Order(100)
@RequiredArgsConstructor
public class RoadmapMetricsDemoSeeder implements RoadmapDataSeeder {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final UserRoadmapEnrollmentRepository enrollmentRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void seed(User author) {
        log.info("Seeding demo enrollments and rating comments for roadmaps...");

        User student1 = getOrCreateStudent("ivan_dev", "ivan@example.com");
        User student2 = getOrCreateStudent("maria_frontend", "maria@example.com");
        User student3 = getOrCreateStudent("alex_backend", "alex@example.com");

        List<Roadmap> roadmaps = roadmapRepository.findAll();
        for (Roadmap roadmap : roadmaps) {
            seedEnrollment(student1, roadmap);
            seedEnrollment(student2, roadmap);

            String title = roadmap.getTitle().toLowerCase();
            if (title.contains("front")) {
                seedEnrollment(student3, roadmap);
                seedComment(student1, roadmap, 5, "Потрясающий план! Шаг за шагом освоил React и TypeScript.");
                seedComment(student2, roadmap, 5, "Очень структурировано, спасибо за понятные темы.");
                seedComment(student3, roadmap, 4, "Хорошая база, особенно секции по верстке и стилям.");
            } else if (title.contains("back")) {
                seedEnrollment(student3, roadmap);
                seedComment(student1, roadmap, 5, "Отличная база по Java и Spring Boot!");
                seedComment(student3, roadmap, 5, "Все ключевые концепции на месте.");
            } else if (title.contains("дизайн") || title.contains("design")) {
                seedComment(student2, roadmap, 5, "Крутой курс по Figma и дизайн-системам!");
                seedComment(student1, roadmap, 4, "Полезно разработчикам для понимания UX.");
            } else {
                seedComment(student3, roadmap, 5, "Качественный материал.");
            }
        }
        log.info("Demo enrollments and rating comments seeded successfully.");
    }

    private User getOrCreateStudent(String name, String email) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("demo123"))
                    .build();
            return userRepository.save(user);
        });
    }

    private void seedEnrollment(User user, Roadmap roadmap) {
        if (!enrollmentRepository.existsByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId())) {
            UserRoadmapEnrollment enrollment = UserRoadmapEnrollment.builder()
                    .id(new UserRoadmapEnrollmentId(user.getId(), roadmap.getId()))
                    .user(user)
                    .roadmap(roadmap)
                    .enrolledAt(Instant.now())
                    .build();
            enrollmentRepository.save(enrollment);
        }
    }

    private void seedComment(User user, Roadmap roadmap, int rating, String text) {
        if (commentRepository.findByRoadmapIdAndAuthorId(roadmap.getId(), user.getId()).isEmpty()) {
            Comment comment = Comment.builder()
                    .author(user)
                    .roadmap(roadmap)
                    .rating(rating)
                    .text(text)
                    .createdAt(Instant.now())
                    .build();
            commentRepository.save(comment);
        }
    }
}
