package com.roadmap.common.seed.data;

import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.RoadmapEdge;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdvancedJavaRoadmapSeederTest {

    @Mock
    private RoadmapRepository roadmapRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private RoadmapTextRepository textRepository;

    @Mock
    private RoadmapEdgeRepository edgeRepository;

    private AdvancedJavaRoadmapSeeder seeder;
    private User testAuthor;

    @BeforeEach
    void setUp() {
        seeder = new AdvancedJavaRoadmapSeeder(roadmapRepository, sectionRepository, nodeRepository, textRepository, edgeRepository);
        testAuthor = User.builder().id(1L).name("demo_author").build();
    }

    @Test
    void shouldSeedAdvancedRoadmapWithSectionsNodesTextsAndEdges() {
        when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(inv -> inv.getArgument(0));
        when(sectionRepository.save(any(Section.class))).thenAnswer(inv -> inv.getArgument(0));
        when(nodeRepository.save(any(Node.class))).thenAnswer(inv -> inv.getArgument(0));
        when(textRepository.save(any(RoadmapText.class))).thenAnswer(inv -> inv.getArgument(0));
        when(edgeRepository.save(any(RoadmapEdge.class))).thenAnswer(inv -> inv.getArgument(0));

        seeder.seed(testAuthor);

        ArgumentCaptor<Roadmap> roadmapCaptor = ArgumentCaptor.forClass(Roadmap.class);
        verify(roadmapRepository, times(1)).save(roadmapCaptor.capture());

        Roadmap savedRoadmap = roadmapCaptor.getValue();
        assertThat(savedRoadmap.getDifficulty()).isEqualTo(RoadmapDifficulty.ADVANCED);
        assertThat(savedRoadmap.getTitle()).isEqualTo("Advanced Java & Performance Engineering");
        assertThat(savedRoadmap.getPrice()).isEqualByComparingTo(new BigDecimal("2990"));

        verify(sectionRepository, times(2)).save(any(Section.class));
        verify(nodeRepository, times(4)).save(any(Node.class));
        verify(edgeRepository, times(3)).save(any(RoadmapEdge.class));
        verify(textRepository, times(1)).save(any(RoadmapText.class));
    }
}
