package com.roadmap.modules.roadmaps.application;

import com.roadmap.common.dto.PageResponse;
import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.roadmaps.api.dto.CreateRoadmapRequest;
import com.roadmap.modules.roadmaps.api.dto.RoadmapResponse;
import com.roadmap.modules.roadmaps.api.dto.UpdateRoadmapRequest;
import com.roadmap.modules.roadmaps.application.mapper.RoadmapMapper;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapAccessDeniedException;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapNotFoundException;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.comments.domain.repository.CommentRepository;
import com.roadmap.modules.progress.domain.repository.UserRoadmapEnrollmentRepository;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapCountProjection;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadmapServiceTest {

    @Mock
    private RoadmapRepository roadmapRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private UserRoadmapEnrollmentRepository enrollmentRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    private RoadmapMapper roadmapMapper;
    private RoadmapService roadmapService;

    private User testAuthor;

    @BeforeEach
    void setUp() {
        roadmapMapper = new RoadmapMapper();
        roadmapService = new RoadmapService(
                roadmapRepository,
                nodeRepository,
                enrollmentRepository,
                commentRepository,
                roadmapMapper,
                currentUserProvider
        );

        testAuthor = User.builder()
                .id(1L)
                .name("alice")
                .email("alice@example.com")
                .password("hash")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    void shouldCreateRoadmapSuccessfully() {
        CreateRoadmapRequest request = new CreateRoadmapRequest(
                "Java Roadmap",
                "Learn Java from scratch",
                "Разработка",
                RoadmapDifficulty.BEGINNER,
                BigDecimal.ZERO,
                RoadmapVisibility.PRIVATE
        );

        when(currentUserProvider.getCurrentUser()).thenReturn(testAuthor);
        when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(invocation -> {
            Roadmap r = invocation.getArgument(0);
            r.setId(10L);
            r.setCreatedAt(Instant.now());
            r.setUpdatedAt(Instant.now());
            return r;
        });

        RoadmapResponse response = roadmapService.createRoadmap(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.title()).isEqualTo("Java Roadmap");
        assertThat(response.authorName()).isEqualTo("alice");
        assertThat(response.visibility()).isEqualTo(RoadmapVisibility.PRIVATE);
        assertThat(response.nodesCount()).isEqualTo(0);
        verify(roadmapRepository).save(any(Roadmap.class));
    }

    @Test
    void shouldGetRoadmapByIdWithNodesCount() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("Spring Boot Guide")
                .author(testAuthor)
                .difficulty(RoadmapDifficulty.INTERMEDIATE)
                .visibility(RoadmapVisibility.PUBLISHED)
                .price(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));
        when(nodeRepository.countNodesByRoadmapIds(any())).thenReturn(List.of(new RoadmapCountProjection(10L, 5L)));
        when(enrollmentRepository.countStudentsByRoadmapIds(any())).thenReturn(List.of(new RoadmapCountProjection(10L, 12L)));
        when(commentRepository.findRatingStatsByRoadmapIds(any())).thenReturn(List.of(new RoadmapRatingStats(10L, 4.8, 3L)));
        when(currentUserProvider.getCurrentUserOptional()).thenReturn(Optional.of(testAuthor));
        when(commentRepository.findByRoadmapIdAndAuthorId(10L, testAuthor.getId()))
                .thenReturn(Optional.of(Comment.builder().rating(5).build()));

        RoadmapResponse response = roadmapService.getRoadmapById(10L);

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.title()).isEqualTo("Spring Boot Guide");
        assertThat(response.nodesCount()).isEqualTo(5L);
        assertThat(response.studentsCount()).isEqualTo(12L);
        assertThat(response.rating()).isEqualTo(4.8);
        assertThat(response.ratingsCount()).isEqualTo(3L);
        assertThat(response.currentUserRating()).isEqualTo(5);
    }

    @Test
    void shouldThrowWhenRoadmapNotFound() {
        when(roadmapRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roadmapService.getRoadmapById(999L))
                .isInstanceOf(RoadmapNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    void shouldThrowAccessDeniedWhenPrivateRoadmapAccessedByGuest() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("Private Roadmap")
                .author(testAuthor)
                .visibility(RoadmapVisibility.PRIVATE)
                .build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));
        when(currentUserProvider.getCurrentUserOptional()).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roadmapService.getRoadmapById(10L))
                .isInstanceOf(RoadmapAccessDeniedException.class)
                .hasMessageContaining("10");
    }

    @Test
    void shouldThrowAccessDeniedWhenPrivateRoadmapAccessedByAnotherUser() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("Private Roadmap")
                .author(testAuthor)
                .visibility(RoadmapVisibility.PRIVATE)
                .build();

        User stranger = User.builder().id(999L).name("stranger").build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));
        when(currentUserProvider.getCurrentUserOptional()).thenReturn(Optional.of(stranger));

        assertThatThrownBy(() -> roadmapService.getRoadmapById(10L))
                .isInstanceOf(RoadmapAccessDeniedException.class)
                .hasMessageContaining("10");
    }

    @Test
    void shouldAllowAccessWhenPrivateRoadmapAccessedByAuthor() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("Private Roadmap")
                .author(testAuthor)
                .visibility(RoadmapVisibility.PRIVATE)
                .build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));
        when(currentUserProvider.getCurrentUserOptional()).thenReturn(Optional.of(testAuthor));
        when(commentRepository.findByRoadmapIdAndAuthorId(10L, testAuthor.getId())).thenReturn(Optional.empty());

        RoadmapResponse response = roadmapService.getRoadmapById(10L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.visibility()).isEqualTo(RoadmapVisibility.PRIVATE);
    }

    @Test
    void shouldUpdateRoadmapMetadata() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("Old Title")
                .description("Old Desc")
                .author(testAuthor)
                .difficulty(RoadmapDifficulty.BEGINNER)
                .visibility(RoadmapVisibility.PRIVATE)
                .price(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));
        when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(inv -> inv.getArgument(0));
        when(nodeRepository.countNodesByRoadmapIds(any())).thenReturn(List.of(new RoadmapCountProjection(10L, 2L)));
        when(enrollmentRepository.countStudentsByRoadmapIds(any())).thenReturn(List.of());
        when(commentRepository.findRatingStatsByRoadmapIds(any())).thenReturn(List.of());

        UpdateRoadmapRequest updateReq = new UpdateRoadmapRequest(
                "New Title",
                "New Desc",
                "Backend",
                RoadmapDifficulty.ADVANCED,
                new BigDecimal("1990"),
                RoadmapVisibility.PUBLISHED
        );

        RoadmapResponse updated = roadmapService.updateRoadmap(10L, updateReq);

        assertThat(updated.title()).isEqualTo("New Title");
        assertThat(updated.description()).isEqualTo("New Desc");
        assertThat(updated.category()).isEqualTo("Backend");
        assertThat(updated.difficulty()).isEqualTo(RoadmapDifficulty.ADVANCED);
        assertThat(updated.price()).isEqualTo(new BigDecimal("1990"));
        assertThat(updated.visibility()).isEqualTo(RoadmapVisibility.PUBLISHED);
    }

    @Test
    void shouldPublishAndHideRoadmap() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("Private Map")
                .author(testAuthor)
                .difficulty(RoadmapDifficulty.BEGINNER)
                .visibility(RoadmapVisibility.PRIVATE)
                .price(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));
        when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(inv -> inv.getArgument(0));
        when(nodeRepository.countNodesByRoadmapIds(any())).thenReturn(List.of());
        when(enrollmentRepository.countStudentsByRoadmapIds(any())).thenReturn(List.of());
        when(commentRepository.findRatingStatsByRoadmapIds(any())).thenReturn(List.of());

        RoadmapResponse published = roadmapService.publishRoadmap(10L);
        assertThat(published.visibility()).isEqualTo(RoadmapVisibility.PUBLISHED);

        RoadmapResponse hidden = roadmapService.hideRoadmap(10L);
        assertThat(hidden.visibility()).isEqualTo(RoadmapVisibility.HIDDEN);
    }

    @Test
    void shouldDeleteRoadmap() {
        Roadmap roadmap = Roadmap.builder()
                .id(10L)
                .title("To Delete")
                .author(testAuthor)
                .build();

        when(roadmapRepository.findById(10L)).thenReturn(Optional.of(roadmap));

        roadmapService.deleteRoadmap(10L);

        verify(roadmapRepository).delete(roadmap);
    }

    @Test
    void shouldGetRoadmapsPage() {
        Roadmap roadmap = Roadmap.builder()
                .id(1L)
                .title("Roadmap 1")
                .author(testAuthor)
                .difficulty(RoadmapDifficulty.BEGINNER)
                .visibility(RoadmapVisibility.PUBLISHED)
                .price(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        PageRequest pageable = PageRequest.of(0, 10);
        when(roadmapRepository.findAll(any(Specification.class), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(roadmap), pageable, 1));
        when(nodeRepository.countNodesByRoadmapIds(any())).thenReturn(List.of(new RoadmapCountProjection(1L, 3L)));
        when(enrollmentRepository.countStudentsByRoadmapIds(any())).thenReturn(List.of(new RoadmapCountProjection(1L, 100L)));
        when(commentRepository.findRatingStatsByRoadmapIds(any())).thenReturn(List.of(new RoadmapRatingStats(1L, 4.9, 15L)));

        PageResponse<RoadmapResponse> result = roadmapService.getRoadmaps(
                null, null, null, null, pageable
        );

        assertThat(result.totalElements()).isEqualTo(1);
        assertThat(result.items()).hasSize(1);
        assertThat(result.items().get(0).nodesCount()).isEqualTo(3L);
        assertThat(result.items().get(0).studentsCount()).isEqualTo(100L);
        assertThat(result.items().get(0).rating()).isEqualTo(4.9);
        assertThat(result.items().get(0).ratingsCount()).isEqualTo(15L);
    }

    @Test
    void shouldExcludePrivateRoadmapsFromCatalog() {
        PageRequest pageable = PageRequest.of(0, 10);
        when(roadmapRepository.findAll(any(Specification.class), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(), pageable, 0));

        PageResponse<RoadmapResponse> result = roadmapService.getRoadmaps(
                null, null, null, RoadmapVisibility.PRIVATE, pageable
        );

        assertThat(result.totalElements()).isEqualTo(0);
        assertThat(result.items()).isEmpty();

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Specification<Roadmap>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(roadmapRepository).findAll(specCaptor.capture(), eq(pageable));
        assertThat(specCaptor.getValue()).isNotNull();
    }
}
