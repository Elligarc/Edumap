package com.roadmap.modules.comments.application;

import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.comments.api.dto.RoadmapRatingResponse;
import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.comments.domain.repository.CommentRepository;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapNotFoundException;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats;
import com.roadmap.modules.users.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private RoadmapRepository roadmapRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private CommentService commentService;

    private User user;
    private Roadmap roadmap;

    @BeforeEach
    void setUp() {
        user = User.builder().id(10L).name("Ivan").email("ivan@test.com").build();
        roadmap = Roadmap.builder().id(100L).title("Java Roadmap").build();
    }

    @Test
    @DisplayName("rateRoadmap создает новую запись Comment при первой оценке")
    void rateRoadmap_shouldCreateNewComment_whenFirstTime() {
        when(roadmapRepository.findById(100L)).thenReturn(Optional.of(roadmap));
        when(currentUserProvider.getCurrentUser()).thenReturn(user);
        when(commentRepository.findByRoadmapIdAndAuthorId(100L, 10L)).thenReturn(Optional.empty());
        when(commentRepository.findRatingStatsByRoadmapIds(List.of(100L)))
                .thenReturn(List.of(new RoadmapRatingStats(100L, 5.0, 1L)));

        RoadmapRatingResponse response = commentService.rateRoadmap(100L, 5);

        ArgumentCaptor<Comment> captor = ArgumentCaptor.forClass(Comment.class);
        verify(commentRepository).save(captor.capture());

        Comment saved = captor.getValue();
        assertThat(saved.getRoadmap()).isEqualTo(roadmap);
        assertThat(saved.getAuthor()).isEqualTo(user);
        assertThat(saved.getRating()).isEqualTo(5);
        assertThat(saved.getText()).isNull();

        assertThat(response.roadmapId()).isEqualTo(100L);
        assertThat(response.averageRating()).isEqualTo(5.0);
        assertThat(response.ratingsCount()).isEqualTo(1L);
        assertThat(response.currentUserRating()).isEqualTo(5);
    }

    @Test
    @DisplayName("rateRoadmap обновляет существующую запись Comment (upsert)")
    void rateRoadmap_shouldUpdateExistingComment_whenAlreadyRated() {
        Comment existing = Comment.builder()
                .id(55L)
                .roadmap(roadmap)
                .author(user)
                .rating(3)
                .text("Existing comment")
                .build();

        when(roadmapRepository.findById(100L)).thenReturn(Optional.of(roadmap));
        when(currentUserProvider.getCurrentUser()).thenReturn(user);
        when(commentRepository.findByRoadmapIdAndAuthorId(100L, 10L)).thenReturn(Optional.of(existing));
        when(commentRepository.findRatingStatsByRoadmapIds(List.of(100L)))
                .thenReturn(List.of(new RoadmapRatingStats(100L, 4.5, 2L)));

        RoadmapRatingResponse response = commentService.rateRoadmap(100L, 5);

        verify(commentRepository).save(existing);
        assertThat(existing.getRating()).isEqualTo(5);
        assertThat(existing.getText()).isEqualTo("Existing comment");

        assertThat(response.averageRating()).isEqualTo(4.5);
        assertThat(response.ratingsCount()).isEqualTo(2L);
        assertThat(response.currentUserRating()).isEqualTo(5);
    }

    @Test
    @DisplayName("rateRoadmap бросает RoadmapNotFoundException если дорожная карта не найдена")
    void rateRoadmap_shouldThrowException_whenRoadmapNotFound() {
        when(roadmapRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.rateRoadmap(999L, 4))
                .isInstanceOf(RoadmapNotFoundException.class);
    }

    @Test
    @DisplayName("getRoadmapRating возвращает агрегаты и оценку текущего пользователя")
    void getRoadmapRating_shouldReturnStatsAndCurrentUserRating() {
        when(roadmapRepository.existsById(100L)).thenReturn(true);
        when(currentUserProvider.getCurrentUserOptional()).thenReturn(Optional.of(user));
        when(commentRepository.findByRoadmapIdAndAuthorId(100L, 10L))
                .thenReturn(Optional.of(Comment.builder().rating(4).build()));
        when(commentRepository.findRatingStatsByRoadmapIds(List.of(100L)))
                .thenReturn(List.of(new RoadmapRatingStats(100L, 4.25, 4L)));

        RoadmapRatingResponse response = commentService.getRoadmapRating(100L);

        assertThat(response.roadmapId()).isEqualTo(100L);
        assertThat(response.averageRating()).isEqualTo(4.3); // округление до 1 знака
        assertThat(response.ratingsCount()).isEqualTo(4L);
        assertThat(response.currentUserRating()).isEqualTo(4);
    }
}
