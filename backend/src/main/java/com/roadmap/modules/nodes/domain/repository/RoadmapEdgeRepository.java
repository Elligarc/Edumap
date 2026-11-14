package com.roadmap.modules.nodes.domain.repository;

import com.roadmap.modules.nodes.domain.model.RoadmapEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoadmapEdgeRepository extends JpaRepository<RoadmapEdge, Long> {

    @Query("SELECT e FROM RoadmapEdge e JOIN FETCH e.sourceNode JOIN FETCH e.targetNode WHERE e.roadmap.id = :roadmapId")
    List<RoadmapEdge> findAllByRoadmapId(@Param("roadmapId") Long roadmapId);

    @Modifying
    @Query("DELETE FROM RoadmapEdge e WHERE e.roadmap.id = :roadmapId")
    void deleteAllByRoadmapId(@Param("roadmapId") Long roadmapId);
}
