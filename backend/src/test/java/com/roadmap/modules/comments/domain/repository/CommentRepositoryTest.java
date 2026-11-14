package com.roadmap.modules.comments.domain.repository;

import com.roadmap.TestcontainersConfiguration;
import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@Transactional
class CommentRepositoryTest {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Test
    @DisplayName("Можно сохранить оценку без текста (text = null) и найти по roadmapId и authorId")
    void shouldSaveRatingWithoutTextAndFindByRoadmapIdAndAuthorId() {
        User user = userRepository.saveAndFlush(User.builder()
                .name("test_voter")
                .email("voter@example.com")
                .password("hash")
                .build());

        Roadmap roadmap = roadmapRepository.saveAndFlush(Roadmap.builder()
                .title("Spring Boot Guide")
                .author(user)
                .difficulty(RoadmapDifficulty.BEGINNER)
                .visibility(RoadmapVisibility.PUBLISHED)
                .price(BigDecimal.ZERO)
                .build());

        Comment ratingOnly = Comment.builder()
                .roadmap(roadmap)
                .author(user)
                .rating(5)
                .text(null)
                .build();

        Comment saved = commentRepository.saveAndFlush(ratingOnly);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getText()).isNull();
        assertThat(saved.getRating()).isEqualTo(5);

        Optional<Comment> found = commentRepository.findByRoadmapIdAndAuthorId(roadmap.getId(), user.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getRating()).isEqualTo(5);

        found.get().setRating(4);
        commentRepository.saveAndFlush(found.get());

        Optional<Comment> updated = commentRepository.findByRoadmapIdAndAuthorId(roadmap.getId(), user.getId());
        assertThat(updated).isPresent();
        assertThat(updated.get().getRating()).isEqualTo(4);

        List<RoadmapRatingStats> stats = commentRepository.findRatingStatsByRoadmapIds(List.of(roadmap.getId()));
        assertThat(stats).hasSize(1);
        assertThat(stats.getFirst().averageRating()).isEqualTo(4.0);
        assertThat(stats.getFirst().ratingsCount()).isEqualTo(1L);
    }
}
