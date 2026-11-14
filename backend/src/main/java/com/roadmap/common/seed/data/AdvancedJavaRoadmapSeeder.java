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
@Order(4)
public class AdvancedJavaRoadmapSeeder extends BaseSeederSupport {

    public AdvancedJavaRoadmapSeeder(RoadmapRepository roadmapRepository,
                                    SectionRepository sectionRepository,
                                    NodeRepository nodeRepository,
                                    RoadmapTextRepository textRepository,
                                    RoadmapEdgeRepository edgeRepository) {
        super(roadmapRepository, sectionRepository, nodeRepository, textRepository, edgeRepository);
    }

    @Override
    public void seed(User author) {
        Roadmap roadmap = roadmapRepository.save(Roadmap.builder()
                .title("Advanced Java & Performance Engineering")
                .description("Глубокое погружение в производительность: архитектура JVM, GC, JMM, lock-free алгоритмы, профилирование и оптимизация highload-систем.")
                .category("Разработка")
                .difficulty(RoadmapDifficulty.ADVANCED)
                .price(new BigDecimal("2990"))
                .visibility(RoadmapVisibility.PUBLISHED)
                .author(author)
                .build());

        saveSection(roadmap, "Архитектура JVM и Профилирование", 80.0, 80.0, 380.0, 540.0, 0);

        Node startNode = saveNode(
                roadmap,
                "Старт: JVM Internals & Сборка мусора",
                NodeType.START,
                "Память JVM (Heap, Metaspace, Stack), алгоритмы сборки мусора (G1, ZGC, Shenandoah), тюнинг флагов и анализ GC-логов.",
                true,
                null,
                150.0,
                140.0,
                List.of(
                        createResource("Oracle: Java Virtual Machine Guide", "https://docs.oracle.com/en/java/javase/21/vm/", "DOCUMENTATION"),
                        createResource("YouTube: Modern Garbage Collection Deep Dive", "https://www.youtube.com/watch?v=sample_gc", "YOUTUBE")
                )
        );

        Node profilingNode = saveNode(
                roadmap,
                "JIT-компиляция & Профилирование",
                NodeType.DEFAULT,
                "C1/C2 компиляторы, девиртуализация, inlining, профилирование CPU и аллокаций с async-profiler и JFR (Java Flight Recorder).",
                true,
                startNode,
                150.0,
                390.0,
                List.of(
                        createResource("async-profiler: Manual & Best Practices", "https://github.com/async-profiler/async-profiler", "ARTICLE")
                )
        );

        saveSection(roadmap, "Многопоточность и Highload", 540.0, 80.0, 380.0, 540.0, 1);

        Node concurrencyNode = saveNode(
                roadmap,
                "Java Memory Model & Lock-free",
                NodeType.DEFAULT,
                "JMM, happens-before, volatile, VarHandle, атомики, CAS-операции и неблокирующие структуры данных (Disruptor).",
                true,
                profilingNode,
                610.0,
                140.0,
                List.of(
                        createResource("Java Concurrency in Practice (Brian Goetz)", "https://jcip.net/", "BOOK")
                )
        );

        Node highloadNode = saveNode(
                roadmap,
                "Финал: Высоконагруженные сетевые сервисы",
                NodeType.END,
                "Virtual Threads под экстремальной нагрузкой, неблокирующий I/O (Netty), zero-allocation подходы и минимизация latency p99.",
                true,
                concurrencyNode,
                610.0,
                390.0,
                List.of(
                        createResource("OpenJDK: Project Loom & Virtual Threads", "https://openjdk.org/projects/loom/", "DOCUMENTATION")
                )
        );

        saveEdge(roadmap, startNode, profilingNode, "bottom", "top");
        saveEdge(roadmap, profilingNode, concurrencyNode, "right", "left");
        saveEdge(roadmap, concurrencyNode, highloadNode, "bottom", "top");

        saveText(roadmap, "⚡ Уровень ADVANCED: фокус на низкоуровневой оптимизации, профилировании без искажений и zero-allocation", 80.0, 660.0);
    }
}
