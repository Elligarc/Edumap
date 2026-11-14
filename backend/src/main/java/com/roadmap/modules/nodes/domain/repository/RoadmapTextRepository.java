package com.roadmap.modules.nodes.domain.repository;

import com.roadmap.modules.nodes.domain.model.RoadmapText;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapTextRepository extends JpaRepository<RoadmapText, Long> {

    List<RoadmapText> findAllByRoadmapIdOrderByIdAsc(Long roadmapId);
}
