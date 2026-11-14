package com.roadmap.modules.comments.domain.repository;

import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findAllByRoadmapId(Long roadmapId);

    List<Comment> findAllByAuthorId(Long authorId);

    Optional<Comment> findByRoadmapIdAndAuthorId(Long roadmapId, Long authorId);

    @Query("""
        SELECT new com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats(
            c.roadmap.id,
            AVG(c.rating * 1.0),
            COUNT(c)
        )
        FROM Comment c
        WHERE c.roadmap.id IN :roadmapIds AND c.rating IS NOT NULL
        GROUP BY c.roadmap.id
    """)
    List<RoadmapRatingStats> findRatingStatsByRoadmapIds(@Param("roadmapIds") Collection<Long> roadmapIds);
}

