package com.roadmap.common.seed;

import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DemoDataInitializerTest {

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

    @Mock
    private CurrentUserProvider currentUserProvider;

    @Mock
    private RoadmapDataSeeder seeder1;

    @Mock
    private RoadmapDataSeeder seeder2;

    private DemoDataInitializer initializer;
    private User testAuthor;

    @BeforeEach
    void setUp() {
        initializer = new DemoDataInitializer(
                roadmapRepository,
                sectionRepository,
                nodeRepository,
                textRepository,
                edgeRepository,
                currentUserProvider,
                List.of(seeder1, seeder2)
        );
        testAuthor = User.builder().id(1L).name("demo_author").build();
    }

    @Test
    void shouldDoNothingWhenSeedDisabled() {
        ReflectionTestUtils.setField(initializer, "seedEnabled", false);
        ReflectionTestUtils.setField(initializer, "resetEnabled", false);

        initializer.run();

        verify(roadmapRepository, never()).deleteAll();
        verify(seeder1, never()).seed(any());
        verify(seeder2, never()).seed(any());
    }

    @Test
    void shouldSkipSeedingWhenDataExistsAndResetDisabled() {
        ReflectionTestUtils.setField(initializer, "seedEnabled", true);
        ReflectionTestUtils.setField(initializer, "resetEnabled", false);
        when(roadmapRepository.count()).thenReturn(5L);

        initializer.run();

        verify(roadmapRepository, never()).deleteAll();
        verify(seeder1, never()).seed(any());
        verify(seeder2, never()).seed(any());
    }

    @Test
    void shouldSeedWhenEmptyAndResetDisabled() {
        ReflectionTestUtils.setField(initializer, "seedEnabled", true);
        ReflectionTestUtils.setField(initializer, "resetEnabled", false);
        when(roadmapRepository.count()).thenReturn(0L);
        when(currentUserProvider.getCurrentUser()).thenReturn(testAuthor);

        initializer.run();

        verify(roadmapRepository, never()).deleteAll();
        verify(seeder1).seed(testAuthor);
        verify(seeder2).seed(testAuthor);
    }

    @Test
    void shouldResetAndSeedWhenResetEnabled() {
        ReflectionTestUtils.setField(initializer, "seedEnabled", true);
        ReflectionTestUtils.setField(initializer, "resetEnabled", true);
        when(currentUserProvider.getCurrentUser()).thenReturn(testAuthor);

        initializer.run();

        verify(edgeRepository).deleteAll();
        verify(nodeRepository).deleteAll();
        verify(sectionRepository).deleteAll();
        verify(textRepository).deleteAll();
        verify(roadmapRepository).deleteAll();
        verify(seeder1).seed(testAuthor);
        verify(seeder2).seed(testAuthor);
    }
}
