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
@Order(2)
public class BackendRoadmapSeeder extends BaseSeederSupport {

    public BackendRoadmapSeeder(RoadmapRepository roadmapRepository,
                                SectionRepository sectionRepository,
                                NodeRepository nodeRepository,
                                RoadmapTextRepository textRepository,
                                RoadmapEdgeRepository edgeRepository) {
        super(roadmapRepository, sectionRepository, nodeRepository, textRepository, edgeRepository);
    }

    @Override
    public void seed(User author) {
        Roadmap roadmap = roadmapRepository.save(Roadmap.builder()
                .title("Backend на Java & Spring Boot")
                .description("Освоение бэкенда корпоративного уровня: Java 21 LTS, архитектура монолита, PostgreSQL и Spring Boot.")
                .category("Разработка")
                .difficulty(RoadmapDifficulty.INTERMEDIATE)
                .price(new BigDecimal("1990"))
                .visibility(RoadmapVisibility.PUBLISHED)
                .author(author)
                .build());

        saveSection(roadmap, "Базовая подготовка и Хранилища", 80.0, 80.0, 380.0, 540.0, 0);

        Node startNode = saveNode(
                roadmap,
                "Старт: Java 21 Core",
                NodeType.START,
                "ООП, Collections, Generics, Stream API, Virtual Threads.",
                true,
                null,
                150.0,
                140.0,
                List.of(
                        createResource("Java Documentation (Oracle)", "https://docs.oracle.com/en/java/", "DOCUMENTATION"),
                        createResource("YouTube: Java 21 New Features Deep Dive", "https://www.youtube.com/watch?v=sample3", "YOUTUBE")
                )
        );

        Node db = saveNode(
                roadmap,
                "PostgreSQL & Базы данных",
                NodeType.DEFAULT,
                "Реляционные модели, SQL, индексы, транзакции, миграции Flyway.",
                true,
                startNode,
                150.0,
                390.0,
                List.of(
                        createResource("PostgreSQL Tutorial", "https://www.postgresqltutorial.com/", "ARTICLE")
                )
        );

        saveSection(roadmap, "Enterprise Framework & Security", 540.0, 80.0, 380.0, 540.0, 1);

        Node spring = saveNode(
                roadmap,
                "Spring Boot & Spring Data JPA",
                NodeType.DEFAULT,
                "DI/IoC, Hibernate, репозитории, слои Controller-Service-Repository.",
                true,
                db,
                610.0,
                140.0,
                List.of(
                        createResource("Spring Boot Official Reference", "https://spring.io/projects/spring-boot", "DOCUMENTATION")
                )
        );

        Node security = saveNode(
                roadmap,
                "Финал: Архитектура, Безопасность и REST API",
                NodeType.END,
                "Spring Security, JWT, валидация DTO (@Valid), обработка ошибок и профилирование.",
                true,
                spring,
                610.0,
                390.0,
                List.of(
                        createResource("Baeldung: Spring Security Tutorial", "https://www.baeldung.com/security-spring", "ARTICLE")
                )
        );

        saveEdge(roadmap, startNode, db, "bottom", "top");
        saveEdge(roadmap, db, spring, "right", "left");
        saveEdge(roadmap, spring, security, "bottom", "top");

        saveText(roadmap, "📌 Практикуйте многопоточность и Virtual Threads на реальных сервисах", 80.0, 660.0);
    }
}
