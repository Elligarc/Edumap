package com.roadmap.modules.nodes.domain.repository;

import com.roadmap.modules.nodes.domain.model.NodeResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeResourceRepository extends JpaRepository<NodeResource, Long> {

    List<NodeResource> findAllByNodeId(Long nodeId);
}
