package com.roadmap.common.seed;

import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDataInitializer implements CommandLineRunner {

    private final RoadmapRepository roadmapRepository;
    private final SectionRepository sectionRepository;
    private final NodeRepository nodeRepository;
    private final RoadmapTextRepository textRepository;
    private final RoadmapEdgeRepository edgeRepository;
    private final CurrentUserProvider currentUserProvider;
    private final List<RoadmapDataSeeder> seeders;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.reset:false}")
    private boolean resetEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("Demo data seeding is disabled (app.seed.enabled=false)");
            return;
        }

        if (resetEnabled) {
            log.info("Resetting existing roadmaps, sections, nodes, edges and texts before seeding (app.seed.reset=true)...");
            edgeRepository.deleteAll();
            nodeRepository.deleteAll();
            sectionRepository.deleteAll();
            textRepository.deleteAll();
            roadmapRepository.deleteAll();
        } else if (roadmapRepository.count() > 0) {
            log.info("Database already contains roadmaps. Skipping seeding (app.seed.reset=false).");
            return;
        }

        User author = currentUserProvider.getCurrentUser();
        log.info("Seeding initial demo roadmaps using {} seeder(s) for author '{}'...", seeders.size(), author.getName());

        for (RoadmapDataSeeder seeder : seeders) {
            seeder.seed(author);
        }

        log.info("Demo data seeding completed successfully.");
    }
}
