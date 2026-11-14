package com.roadmap.modules.progress.domain.repository;

import com.roadmap.modules.progress.domain.model.UserProgress;
import com.roadmap.modules.progress.domain.model.UserProgressId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UserProgressId> {

    List<UserProgress> findAllByIdUserId(Long userId);

    List<UserProgress> findAllByIdNodeId(Long nodeId);

    Optional<UserProgress> findByIdUserIdAndIdNodeId(Long userId, Long nodeId);

    @Query("SELECT up FROM UserProgress up WHERE up.id.userId = :userId AND up.node.roadmap.id = :roadmapId")
    List<UserProgress> findAllByUserIdAndRoadmapId(@Param("userId") Long userId, @Param("roadmapId") Long roadmapId);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.id.userId = :userId AND up.node.roadmap.id = :roadmapId AND up.isCompleted = true")
    long countCompletedByUserIdAndRoadmapId(@Param("userId") Long userId, @Param("roadmapId") Long roadmapId);
}
