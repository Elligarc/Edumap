package com.roadmap.modules.roadmaps.domain.repository;

import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long>, JpaSpecificationExecutor<Roadmap> {

    List<Roadmap> findAllByAuthorId(Long authorId);

    List<Roadmap> findAllByVisibility(RoadmapVisibility visibility);

    List<Roadmap> findAllByCategoryIgnoreCase(String category);
}
