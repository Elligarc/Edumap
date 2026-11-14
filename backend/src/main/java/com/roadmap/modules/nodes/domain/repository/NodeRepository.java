package com.roadmap.modules.nodes.domain.repository;

import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapCountProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {

    List<Node> findAllByRoadmapId(Long roadmapId);

    List<Node> findAllByParentNodeId(Long parentNodeId);

    long countByRoadmapId(Long roadmapId);

    @Query("""
        SELECT new com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapCountProjection(
            n.roadmap.id,
            COUNT(n)
        )
        FROM Node n
        WHERE n.roadmap.id IN :roadmapIds
        GROUP BY n.roadmap.id
    """)
    List<RoadmapCountProjection> countNodesByRoadmapIds(@Param("roadmapIds") Collection<Long> roadmapIds);

    boolean existsByRoadmapIdAndType(Long roadmapId, NodeType type);

    boolean existsByRoadmapIdAndTypeAndIdNot(Long roadmapId, NodeType type, Long id);
}

