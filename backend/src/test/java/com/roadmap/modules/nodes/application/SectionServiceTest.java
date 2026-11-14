package com.roadmap.modules.nodes.application;

import com.roadmap.modules.nodes.api.dto.CreateSectionRequest;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.UpdateSectionRequest;
import com.roadmap.modules.nodes.application.mapper.SectionMapper;
import com.roadmap.modules.nodes.domain.exception.SectionNotFoundException;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SectionServiceTest {

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private RoadmapService roadmapService;

    private SectionMapper sectionMapper;
    private SectionService sectionService;
    private Roadmap testRoadmap;

    @BeforeEach
    void setUp() {
        sectionMapper = new SectionMapper();
        sectionService = new SectionService(sectionRepository, roadmapService, sectionMapper);
        testRoadmap = Roadmap.builder().id(10L).title("Test Roadmap").build();
    }

    @Test
    void shouldGetSectionsByRoadmapId() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        Section section = Section.builder()
                .id(1L)
                .roadmap(testRoadmap)
                .title("Section 1")
                .positionX(10.0)
                .positionY(20.0)
                .sortOrder(0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(10L)).thenReturn(List.of(section));

        List<SectionResponse> responses = sectionService.getSectionsByRoadmapId(10L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).title()).isEqualTo("Section 1");
    }

    @Test
    void shouldCreateSection() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        CreateSectionRequest request = new CreateSectionRequest(
                "New Section",
                50.0,
                100.0,
                300.0,
                200.0,
                1
        );

        when(sectionRepository.save(any(Section.class))).thenAnswer(inv -> {
            Section s = inv.getArgument(0);
            s.setId(2L);
            s.setCreatedAt(Instant.now());
            s.setUpdatedAt(Instant.now());
            return s;
        });

        SectionResponse response = sectionService.createSection(10L, request);

        assertThat(response.id()).isEqualTo(2L);
        assertThat(response.title()).isEqualTo("New Section");
        assertThat(response.positionX()).isEqualTo(50.0);
        assertThat(response.positionY()).isEqualTo(100.0);
        assertThat(response.width()).isEqualTo(300.0);
        assertThat(response.height()).isEqualTo(200.0);
    }

    @Test
    void shouldUpdateSection() {
        Section section = Section.builder()
                .id(3L)
                .roadmap(testRoadmap)
                .title("Old Title")
                .positionX(0.0)
                .positionY(0.0)
                .sortOrder(0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(sectionRepository.findById(3L)).thenReturn(Optional.of(section));

        UpdateSectionRequest request = new UpdateSectionRequest(
                "Updated Title",
                120.0,
                220.0,
                null,
                null,
                5
        );

        SectionResponse response = sectionService.updateSection(3L, request);

        assertThat(response.title()).isEqualTo("Updated Title");
        assertThat(response.positionX()).isEqualTo(120.0);
        assertThat(response.positionY()).isEqualTo(220.0);
        assertThat(response.sortOrder()).isEqualTo(5);
    }

    @Test
    void shouldDeleteSection() {
        Section section = Section.builder().id(4L).roadmap(testRoadmap).title("To Delete").build();
        when(sectionRepository.findById(4L)).thenReturn(Optional.of(section));

        sectionService.deleteSection(4L);

        verify(sectionRepository).delete(section);
    }

    @Test
    void shouldThrowWhenSectionNotFound() {
        when(sectionRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sectionService.getSectionById(999L))
                .isInstanceOf(SectionNotFoundException.class)
                .hasMessageContaining("999");
    }
}
