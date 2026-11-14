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
@Order(1)
public class FrontendRoadmapSeeder extends BaseSeederSupport {

    public FrontendRoadmapSeeder(RoadmapRepository roadmapRepository,
                                 SectionRepository sectionRepository,
                                 NodeRepository nodeRepository,
                                 RoadmapTextRepository textRepository,
                                 RoadmapEdgeRepository edgeRepository) {
        super(roadmapRepository, sectionRepository, nodeRepository, textRepository, edgeRepository);
    }

    @Override
    public void seed(User author) {
        Roadmap roadmap = roadmapRepository.save(Roadmap.builder()
                .title("Frontend-разработчик 2026")
                .description("Современный пошаговый трек: от HTML5 и CSS3 до React 19, TypeScript и сборщиков.")
                .category("Разработка")
                .difficulty(RoadmapDifficulty.BEGINNER)
                .price(BigDecimal.ZERO)
                .visibility(RoadmapVisibility.PUBLISHED)
                .author(author)
                .build());

        saveSection(roadmap, "Основы Web и Верстка", 80.0, 80.0, 380.0, 780.0, 0);

        Node htmlCss = saveNode(
                roadmap,
                "Старт: Введение и Основы Web",
                NodeType.START,
                "Семантическая верстка, flexbox, CSS Grid и базовые протоколы веба.",
                true,
                null,
                150.0,
                140.0,
                List.of(
                        createResource("MDN Web Docs: HTML Basics", "https://developer.mozilla.org/ru/docs/Learn/HTML", "ARTICLE"),
                        createResource("YouTube: HTML и CSS с нуля за 1 час", "https://www.youtube.com/watch?v=sample1", "YOUTUBE")
                )
        );

        Node html5 = saveNode(
                roadmap,
                "Семантический HTML5",
                NodeType.DEFAULT,
                "Изучите header, nav, main, section, footer и микроразметку.",
                true,
                htmlCss,
                150.0,
                390.0,
                List.of(
                        createResource("W3C HTML5 Specification", "https://html.spec.whatwg.org/", "DOCUMENTATION")
                )
        );

        Node flexbox = saveNode(
                roadmap,
                "Flexbox & Grid Layouts",
                NodeType.DEFAULT,
                "Построение одномерных и двумерных макетов в современном CSS.",
                true,
                html5,
                150.0,
                640.0,
                List.of(
                        createResource("CSS-Tricks: A Complete Guide to Flexbox", "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", "ARTICLE"),
                        createResource("Flexbox Froggy Game", "https://flexboxfroggy.com/", "WEBSITE")
                )
        );

        saveSection(roadmap, "JavaScript & Фреймворки", 540.0, 80.0, 380.0, 530.0, 1);

        Node js = saveNode(
                roadmap,
                "JavaScript (ES2024+)",
                NodeType.DEFAULT,
                "Синтаксис, структуры данных, функции, Event Loop.",
                true,
                htmlCss,
                610.0,
                140.0,
                List.of(
                        createResource("Learn JavaScript (learn.javascript.ru)", "https://learn.javascript.ru/", "ARTICLE"),
                        createResource("YouTube: JavaScript Event Loop Explained", "https://www.youtube.com/watch?v=sample2", "YOUTUBE")
                )
        );

        Node react = saveNode(
                roadmap,
                "React 19 & Экосистема",
                NodeType.DEFAULT,
                "Компоненты, хуки, Virtual DOM, TanStack Query.",
                true,
                js,
                610.0,
                390.0,
                List.of(
                        createResource("Official React Docs", "https://react.dev/", "DOCUMENTATION")
                )
        );

        Node deploy = saveNode(
                roadmap,
                "Финал: Сборка и Деплой (Vite & CI/CD)",
                NodeType.END,
                "Конфигурация сборщика, продакшн-билд, запуск тестов и развертывание.",
                false,
                react,
                980.0,
                260.0,
                List.of(
                        createResource("Vite Guide", "https://vite.dev/guide/", "DOCUMENTATION")
                )
        );

        saveEdge(roadmap, htmlCss, html5, "bottom", "top");
        saveEdge(roadmap, html5, flexbox, "bottom", "top");
        saveEdge(roadmap, htmlCss, js, "right", "left");
        saveEdge(roadmap, js, react, "bottom", "top");
        saveEdge(roadmap, react, deploy, "right", "left");

        saveText(roadmap, "💡 Рекомендуется сначала закрепить верстку на реальных макетах", 80.0, 890.0);
        saveText(roadmap, "⚡ В React 19 используется новый React Compiler", 540.0, 640.0);
    }
}
