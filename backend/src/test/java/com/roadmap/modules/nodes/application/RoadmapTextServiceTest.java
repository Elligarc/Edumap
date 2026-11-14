package com.roadmap.modules.nodes.application;

import com.roadmap.modules.nodes.api.dto.CreateTextRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.UpdateTextRequest;
import com.roadmap.modules.nodes.application.mapper.RoadmapTextMapper;
import com.roadmap.modules.nodes.domain.exception.RoadmapTextNotFoundException;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
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
class RoadmapTextServiceTest {

    @Mock
    private RoadmapTextRepository textRepository;

    @Mock
    private RoadmapService roadmapService;

    private RoadmapTextMapper textMapper;
    private RoadmapTextService textService;
    private Roadmap testRoadmap;

    @BeforeEach
    void setUp() {
        textMapper = new RoadmapTextMapper();
        textService = new RoadmapTextService(textRepository, roadmapService, textMapper);
        testRoadmap = Roadmap.builder().id(10L).title("Test Roadmap").build();
    }

    @Test
    void shouldGetTextsByRoadmapId() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        RoadmapText text = RoadmapText.builder()
                .id(1L)
                .roadmap(testRoadmap)
                .content("Note 1")
                .positionX(15.0)
                .positionY(25.0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(textRepository.findAllByRoadmapIdOrderByIdAsc(10L)).thenReturn(List.of(text));

        List<RoadmapTextResponse> responses = textService.getTextsByRoadmapId(10L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).content()).isEqualTo("Note 1");
    }

    @Test
    void shouldCreateText() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        CreateTextRequest request = new CreateTextRequest("Canvas Note", 30.0, 40.0);

        when(textRepository.save(any(RoadmapText.class))).thenAnswer(inv -> {
            RoadmapText t = inv.getArgument(0);
            t.setId(2L);
            t.setCreatedAt(Instant.now());
            t.setUpdatedAt(Instant.now());
            return t;
        });

        RoadmapTextResponse response = textService.createText(10L, request);

        assertThat(response.id()).isEqualTo(2L);
        assertThat(response.content()).isEqualTo("Canvas Note");
        assertThat(response.positionX()).isEqualTo(30.0);
        assertThat(response.positionY()).isEqualTo(40.0);
    }

    @Test
    void shouldUpdateText() {
        RoadmapText text = RoadmapText.builder()
                .id(3L)
                .roadmap(testRoadmap)
                .content("Old Content")
                .positionX(10.0)
                .positionY(20.0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(textRepository.findById(3L)).thenReturn(Optional.of(text));

        UpdateTextRequest request = new UpdateTextRequest("Updated Content", 55.0, 65.0);

        RoadmapTextResponse response = textService.updateText(3L, request);

        assertThat(response.content()).isEqualTo("Updated Content");
        assertThat(response.positionX()).isEqualTo(55.0);
        assertThat(response.positionY()).isEqualTo(65.0);
    }

    @Test
    void shouldDeleteText() {
        RoadmapText text = RoadmapText.builder().id(4L).roadmap(testRoadmap).content("To Delete").build();
        when(textRepository.findById(4L)).thenReturn(Optional.of(text));

        textService.deleteText(4L);

        verify(textRepository).delete(text);
    }

    @Test
    void shouldThrowWhenTextNotFound() {
        when(textRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> textService.getTextById(999L))
                .isInstanceOf(RoadmapTextNotFoundException.class)
                .hasMessageContaining("999");
    }
}
