package com.roadmap;

import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.comments.domain.repository.CommentRepository;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.progress.domain.model.UserProgress;
import com.roadmap.modules.progress.domain.model.UserProgressId;
import com.roadmap.modules.progress.domain.repository.UserProgressRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.teams.domain.model.Team;
import com.roadmap.modules.teams.domain.model.TeamMember;
import com.roadmap.modules.teams.domain.model.TeamMemberId;
import com.roadmap.modules.teams.domain.repository.TeamMemberRepository;
import com.roadmap.modules.teams.domain.repository.TeamRepository;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@Transactional
class SchemaAndRepositoriesIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private com.roadmap.modules.nodes.domain.repository.SectionRepository sectionRepository;

    @Autowired
    private com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository textRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Test
    void shouldPersistAndRetrieveEntitiesAcrossAllModules() {
        User author = User.builder()
                .name("alice")
                .email("alice@example.com")
                .password("hashed-password-123")
                .build();
        author = userRepository.saveAndFlush(author);

        assertThat(author.getId()).isNotNull();
        assertThat(author.getCreatedAt()).isNotNull();
        assertThat(author.getUpdatedAt()).isNotNull();

        User student = User.builder()
                .name("bob")
                .email("bob@example.com")
                .password("hashed-password-456")
                .build();
        student = userRepository.saveAndFlush(student);

        Roadmap roadmap = Roadmap.builder()
                .title("Fullstack Java Developer")
                .description("Complete learning roadmap")
                .category("Разработка")
                .difficulty(RoadmapDifficulty.INTERMEDIATE)
                .price(new BigDecimal("9900"))
                .author(author)
                .visibility(RoadmapVisibility.PUBLISHED)
                .build();
        roadmap = roadmapRepository.saveAndFlush(roadmap);

        assertThat(roadmap.getId()).isNotNull();
        assertThat(roadmap.getCreatedAt()).isNotNull();
        assertThat(roadmap.getUpdatedAt()).isNotNull();

        com.roadmap.modules.nodes.domain.model.Section section = com.roadmap.modules.nodes.domain.model.Section.builder()
                .roadmap(roadmap)
                .title("Core Fundamentals")
                .positionX(100.0)
                .positionY(150.0)
                .width(400.0)
                .height(300.0)
                .sortOrder(0)
                .build();
        section = sectionRepository.saveAndFlush(section);
        assertThat(section.getId()).isNotNull();

        com.roadmap.modules.nodes.domain.model.RoadmapText canvasText = com.roadmap.modules.nodes.domain.model.RoadmapText.builder()
                .roadmap(roadmap)
                .content("Important Note for Beginners")
                .positionX(20.0)
                .positionY(30.0)
                .build();
        canvasText = textRepository.saveAndFlush(canvasText);
        assertThat(canvasText.getId()).isNotNull();

        Node rootNode = Node.builder()
                .roadmap(roadmap)
                .positionX(120.0)
                .positionY(180.0)
                .title("Java Basics")
                .type(com.roadmap.modules.nodes.domain.model.NodeType.START)
                .content("Learn syntax and OOP")
                .isRequired(true)
                .build();
        rootNode = nodeRepository.saveAndFlush(rootNode);

        Node childNode = Node.builder()
                .roadmap(roadmap)
                .positionX(120.0)
                .positionY(280.0)
                .title("Spring Boot")
                .type(com.roadmap.modules.nodes.domain.model.NodeType.DEFAULT)
                .content("Learn dependency injection and Web")
                .isRequired(true)
                .parentNode(rootNode)
                .build();
        childNode = nodeRepository.saveAndFlush(childNode);

        assertThat(childNode.getParentNode().getId()).isEqualTo(rootNode.getId());

        List<Node> roadmapNodes = nodeRepository.findAllByRoadmapId(roadmap.getId());
        assertThat(roadmapNodes).hasSize(2);
        assertThat(sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(roadmap.getId())).hasSize(1);
        assertThat(textRepository.findAllByRoadmapIdOrderByIdAsc(roadmap.getId())).hasSize(1);

        Comment comment = Comment.builder()
                .text("Excellent roadmap, very structured!")
                .author(student)
                .roadmap(roadmap)
                .rating(5)
                .build();
        comment = commentRepository.saveAndFlush(comment);

        assertThat(comment.getId()).isNotNull();
        assertThat(commentRepository.findAllByRoadmapId(roadmap.getId())).hasSize(1);

        Team team = Team.builder()
                .name("Backend Learners")
                .owner(author)
                .build();
        team = teamRepository.saveAndFlush(team);

        TeamMemberId memberId = new TeamMemberId(team.getId(), student.getId());
        TeamMember teamMember = TeamMember.builder()
                .id(memberId)
                .team(team)
                .user(student)
                .build();
        teamMember = teamMemberRepository.saveAndFlush(teamMember);

        assertThat(teamMemberRepository.findAllByIdTeamId(team.getId())).hasSize(1);
        assertThat(teamMemberRepository.findAllByIdUserId(student.getId())).hasSize(1);

        UserProgressId progressId = new UserProgressId(student.getId(), rootNode.getId());
        UserProgress progress = UserProgress.builder()
                .id(progressId)
                .user(student)
                .node(rootNode)
                .isCompleted(true)
                .completedAt(Instant.now())
                .build();
        progress = userProgressRepository.saveAndFlush(progress);

        Optional<UserProgress> foundProgress = userProgressRepository.findById(progressId);
        assertThat(foundProgress).isPresent();
        assertThat(foundProgress.get().isCompleted()).isTrue();
    }
}
