package com.roadmap.modules.progress.domain.repository;

import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollment;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollmentId;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapCountProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface UserRoadmapEnrollmentRepository extends JpaRepository<UserRoadmapEnrollment, UserRoadmapEnrollmentId> {

    boolean existsByIdUserIdAndIdRoadmapId(Long userId, Long roadmapId);

    List<UserRoadmapEnrollment> findAllByIdUserId(Long userId);

    void deleteByIdUserIdAndIdRoadmapId(Long userId, Long roadmapId);

    long countByIdRoadmapId(Long roadmapId);

    @Query("""
        SELECT new com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapCountProjection(
            e.id.roadmapId,
            COUNT(e)
        )
        FROM UserRoadmapEnrollment e
        WHERE e.id.roadmapId IN :roadmapIds
        GROUP BY e.id.roadmapId
    """)
    List<RoadmapCountProjection> countStudentsByRoadmapIds(@Param("roadmapIds") Collection<Long> roadmapIds);
}

