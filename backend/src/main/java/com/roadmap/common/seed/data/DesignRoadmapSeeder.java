package com.roadmap.common.seed.data;

import com.roadmap.common.seed.BaseSeederSupport;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Order(3)
public class DesignRoadmapSeeder extends BaseSeederSupport {

    public DesignRoadmapSeeder(RoadmapRepository roadmapRepository,
                               SectionRepository sectionRepository,
                               NodeRepository nodeRepository,
                               RoadmapTextRepository textRepository,
                               RoadmapEdgeRepository edgeRepository) {
        super(roadmapRepository, sectionRepository, nodeRepository, textRepository, edgeRepository);
    }

    @Override
    public void seed(User author) {
        Roadmap roadmap = roadmapRepository.save(Roadmap.builder()
                .title("UI/UX Дизайн в Figma")
                .description("Проектирование веб-интерфейсов, работа с дизайн-системами, сетками и интерактивными прототипами.")
                .category("Дизайн")
                .difficulty(RoadmapDifficulty.BEGINNER)
                .price(BigDecimal.ZERO)
                .visibility(RoadmapVisibility.PUBLISHED)
                .author(author)
                .build());

        saveSection(roadmap, "Дизайн-система и Сетки", 80.0, 80.0, 380.0, 540.0, 0);

        Node start = saveNode(
                roadmap,
                "Старт: Основы типографики и 8-pt сетки",
                NodeType.START,
                "Иерархия шрифтов, контрастность, базовые модульные сетки.",
                true,
                null,
                150.0,
                140.0,
                List.of(
                        createResource("Material Design: Layout Grid", "https://m3.material.io/foundations/layout/understanding-layout/overview", "DOCUMENTATION")
                )
        );

        Node components = saveNode(
                roadmap,
                "Компоненты и Auto Layout в Figma",
                NodeType.DEFAULT,
                "Варианты компонентов, адаптивные контейнеры, токены стилей.",
                true,
                start,
                150.0,
                390.0,
                List.of(
                        createResource("YouTube: Figma Auto Layout Masterclass", "https://www.youtube.com/watch?v=sample4", "YOUTUBE")
                )
        );

        saveEdge(roadmap, start, components, "bottom", "top");

        saveText(roadmap, "🎨 Все размеры, отступы и цвета сверяются с макетом в Figma", 80.0, 660.0);
    }
}
