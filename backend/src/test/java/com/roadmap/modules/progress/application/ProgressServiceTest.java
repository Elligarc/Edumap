package com.roadmap.modules.progress.application;

import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.progress.api.dto.MyRoadmapsProgressResponse;
import com.roadmap.modules.progress.api.dto.RoadmapProgressDetailResponse;
import com.roadmap.modules.progress.domain.model.UserProgress;
import com.roadmap.modules.progress.domain.model.UserProgressId;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollment;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollmentId;
import com.roadmap.modules.progress.domain.repository.UserProgressRepository;
import com.roadmap.modules.progress.domain.repository.UserRoadmapEnrollmentRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock
    private CurrentUserProvider currentUserProvider;

    @Mock
    private RoadmapRepository roadmapRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @Mock
    private UserRoadmapEnrollmentRepository enrollmentRepository;

    @InjectMocks
    private ProgressService progressService;

    private User user;
    private Roadmap roadmap;
    private Node node;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("user@example.com").build();
        roadmap = Roadmap.builder().id(10L).title("Frontend Roadmap").build();
        node = Node.builder().id(100L).roadmap(roadmap).title("HTML").build();
    }

    @Test
    void getMyRoadmapsProgress_shouldSeparateInProgressAndCompleted() {
        when(currentUserProvider.getCurrentUser()).thenReturn(user);

        UserRoadmapEnrollment enrollment = UserRoadmapEnrollment.builder()
                .id(new UserRoadmapEnrollmentId(user.getId(), roadmap.getId()))
                .user(user)
                .roadmap(roadmap)
                .build();

        when(enrollmentRepository.findAllByIdUserId(user.getId())).thenReturn(List.of(enrollment));
        when(userProgressRepository.findAllByIdUserId(user.getId())).thenReturn(Collections.emptyList());
        when(enrollmentRepository.existsByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId())).thenReturn(true);
        when(roadmapRepository.findById(roadmap.getId())).thenReturn(Optional.of(roadmap));
        when(nodeRepository.countByRoadmapId(roadmap.getId())).thenReturn(10L);
        when(userProgressRepository.countCompletedByUserIdAndRoadmapId(user.getId(), roadmap.getId())).thenReturn(5L);

        MyRoadmapsProgressResponse response = progressService.getMyRoadmapsProgress();

        assertThat(response.inProgress()).hasSize(1);
        assertThat(response.inProgress().get(0).progressPercent()).isEqualTo(50);
        assertThat(response.completed()).isEmpty();
    }

    @Test
    void getMyRoadmapsProgress_shouldNotIncludeRoadmap_whenUserNotEnrolledAndZeroCompletedNodes() {
        when(currentUserProvider.getCurrentUser()).thenReturn(user);

        when(enrollmentRepository.findAllByIdUserId(user.getId())).thenReturn(Collections.emptyList());
        when(userProgressRepository.findAllByIdUserId(user.getId())).thenReturn(Collections.emptyList());

        MyRoadmapsProgressResponse response = progressService.getMyRoadmapsProgress();

        assertThat(response.inProgress()).isEmpty();
        assertThat(response.completed()).isEmpty();
    }

    @Test
    void enroll_shouldSaveEnrollmentWhenNotEnrolled() {
        when(currentUserProvider.getCurrentUser()).thenReturn(user);
        when(roadmapRepository.findById(roadmap.getId())).thenReturn(Optional.of(roadmap));
        when(enrollmentRepository.existsByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId())).thenReturn(false);
        when(userProgressRepository.findAllByUserIdAndRoadmapId(user.getId(), roadmap.getId())).thenReturn(Collections.emptyList());
        when(nodeRepository.countByRoadmapId(roadmap.getId())).thenReturn(5L);

        RoadmapProgressDetailResponse response = progressService.enroll(roadmap.getId());

        verify(enrollmentRepository).save(any(UserRoadmapEnrollment.class));
        assertThat(response.roadmapId()).isEqualTo(roadmap.getId());
    }

    @Test
    void unenroll_shouldDeleteEnrollmentAndClearProgress() {
        when(currentUserProvider.getCurrentUser()).thenReturn(user);
        when(roadmapRepository.findById(roadmap.getId())).thenReturn(Optional.of(roadmap));

        UserProgress existingProgress = UserProgress.builder()
                .id(new UserProgressId(user.getId(), node.getId()))
                .node(node)
                .user(user)
                .isCompleted(true)
                .build();

        when(userProgressRepository.findAllByUserIdAndRoadmapId(user.getId(), roadmap.getId()))
                .thenReturn(List.of(existingProgress))
                .thenReturn(Collections.emptyList());
        when(nodeRepository.countByRoadmapId(roadmap.getId())).thenReturn(5L);

        RoadmapProgressDetailResponse response = progressService.unenroll(roadmap.getId());

        verify(enrollmentRepository).deleteByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId());
        verify(userProgressRepository).deleteAll(any());
        assertThat(response.isEnrolled()).isFalse();
    }

    @Test
    void toggleNodeProgress_shouldMarkNodeAsCompleted() {
        when(currentUserProvider.getCurrentUser()).thenReturn(user);
        when(roadmapRepository.findById(roadmap.getId())).thenReturn(Optional.of(roadmap));
        when(nodeRepository.findById(node.getId())).thenReturn(Optional.of(node));
        when(userProgressRepository.findByIdUserIdAndIdNodeId(user.getId(), node.getId())).thenReturn(Optional.empty());

        UserProgress savedProgress = UserProgress.builder()
                .id(new UserProgressId(user.getId(), node.getId()))
                .node(node)
                .user(user)
                .isCompleted(true)
                .completedAt(Instant.now())
                .build();

        when(userProgressRepository.findAllByUserIdAndRoadmapId(user.getId(), roadmap.getId()))
                .thenReturn(List.of(savedProgress));
        when(nodeRepository.countByRoadmapId(roadmap.getId())).thenReturn(2L);

        RoadmapProgressDetailResponse response = progressService.toggleNodeProgress(roadmap.getId(), node.getId());

        verify(userProgressRepository).save(any(UserProgress.class));
        assertThat(response.completedNodeIds()).contains(node.getId());
        assertThat(response.progressPercent()).isEqualTo(50);
    }

    @Test
    void toggleNodeProgress_shouldDeleteProgressWhenNodeWasAlreadyCompleted() {
        when(currentUserProvider.getCurrentUser()).thenReturn(user);
        when(roadmapRepository.findById(roadmap.getId())).thenReturn(Optional.of(roadmap));
        when(nodeRepository.findById(node.getId())).thenReturn(Optional.of(node));

        UserProgress existingProgress = UserProgress.builder()
                .id(new UserProgressId(user.getId(), node.getId()))
                .node(node)
                .user(user)
                .isCompleted(true)
                .completedAt(Instant.now())
                .build();

        when(userProgressRepository.findByIdUserIdAndIdNodeId(user.getId(), node.getId()))
                .thenReturn(Optional.of(existingProgress));
        when(userProgressRepository.findAllByUserIdAndRoadmapId(user.getId(), roadmap.getId()))
                .thenReturn(Collections.emptyList());
        when(nodeRepository.countByRoadmapId(roadmap.getId())).thenReturn(2L);

        RoadmapProgressDetailResponse response = progressService.toggleNodeProgress(roadmap.getId(), node.getId());

        verify(userProgressRepository).delete(existingProgress);
        assertThat(response.completedNodeIds()).isEmpty();
        assertThat(response.progressPercent()).isEqualTo(0);
    }
}
