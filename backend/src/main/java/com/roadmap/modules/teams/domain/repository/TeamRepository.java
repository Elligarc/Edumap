package com.roadmap.modules.teams.domain.repository;

import com.roadmap.modules.teams.domain.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findAllByOwnerId(Long ownerId);
}
