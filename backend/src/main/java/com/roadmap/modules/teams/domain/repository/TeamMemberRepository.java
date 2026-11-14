package com.roadmap.modules.teams.domain.repository;

import com.roadmap.modules.teams.domain.model.TeamMember;
import com.roadmap.modules.teams.domain.model.TeamMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, TeamMemberId> {

    List<TeamMember> findAllByIdTeamId(Long teamId);

    List<TeamMember> findAllByIdUserId(Long userId);
}
