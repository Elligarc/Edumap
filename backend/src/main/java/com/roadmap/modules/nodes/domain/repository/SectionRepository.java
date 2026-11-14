package com.roadmap.modules.nodes.domain.repository;

import com.roadmap.modules.nodes.domain.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    List<Section> findAllByRoadmapIdOrderBySortOrderAscIdAsc(Long roadmapId);
}
