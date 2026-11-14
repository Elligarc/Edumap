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
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FrontendRoadmapSeederTest {

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

    private FrontendRoadmapSeeder seeder;
    private User testAuthor;

    @BeforeEach
    void setUp() {
        seeder = new FrontendRoadmapSeeder(roadmapRepository, sectionRepository, nodeRepository, textRepository, edgeRepository);
        testAuthor = User.builder().id(1L).name("demo_author").build();
    }

    @Test
    void shouldSeedFrontendRoadmapWithSectionsNodesTextsAndEdges() {
        when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(inv -> inv.getArgument(0));
        when(sectionRepository.save(any(Section.class))).thenAnswer(inv -> inv.getArgument(0));
        when(nodeRepository.save(any(Node.class))).thenAnswer(inv -> inv.getArgument(0));
        when(textRepository.save(any(RoadmapText.class))).thenAnswer(inv -> inv.getArgument(0));
        when(edgeRepository.save(any(RoadmapEdge.class))).thenAnswer(inv -> inv.getArgument(0));

        seeder.seed(testAuthor);

        verify(roadmapRepository, times(1)).save(any(Roadmap.class));
        verify(sectionRepository, times(2)).save(any(Section.class)); // 2 sections
        verify(nodeRepository, times(6)).save(any(Node.class));       // 6 nodes
        verify(edgeRepository, times(5)).save(any(RoadmapEdge.class)); // 5 edges
        verify(textRepository, times(2)).save(any(RoadmapText.class)); // 2 texts
    }
}
