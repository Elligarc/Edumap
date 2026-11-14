package com.roadmap.modules.progress.application;

import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.nodes.domain.exception.NodeNotFoundException;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.progress.api.dto.MyRoadmapsProgressResponse;
import com.roadmap.modules.progress.api.dto.ProgressRoadmapCardDto;
import com.roadmap.modules.progress.api.dto.RoadmapProgressDetailResponse;
import com.roadmap.modules.progress.domain.model.UserProgress;
import com.roadmap.modules.progress.domain.model.UserProgressId;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollment;
import com.roadmap.modules.progress.domain.model.UserRoadmapEnrollmentId;
import com.roadmap.modules.progress.domain.repository.UserProgressRepository;
import com.roadmap.modules.progress.domain.repository.UserRoadmapEnrollmentRepository;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapNotFoundException;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.users.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {

    private final CurrentUserProvider currentUserProvider;
    private final RoadmapRepository roadmapRepository;
    private final NodeRepository nodeRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRoadmapEnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public MyRoadmapsProgressResponse getMyRoadmapsProgress() {
        User user = currentUserProvider.getCurrentUser();
        List<UserRoadmapEnrollment> enrollments = enrollmentRepository.findAllByIdUserId(user.getId());

        Set<Long> candidateIds = new LinkedHashSet<>();
        for (UserRoadmapEnrollment e : enrollments) {
            candidateIds.add(e.getId().getRoadmapId());
        }

        List<UserProgress> userProgressList = userProgressRepository.findAllByIdUserId(user.getId());
        for (UserProgress up : userProgressList) {
            if (up.isCompleted() && up.getNode() != null && up.getNode().getRoadmap() != null) {
                candidateIds.add(up.getNode().getRoadmap().getId());
            }
        }

        List<ProgressRoadmapCardDto> inProgress = new ArrayList<>();
        List<ProgressRoadmapCardDto> completed = new ArrayList<>();

        for (Long rId : candidateIds) {
            boolean isEnrolled = enrollmentRepository.existsByIdUserIdAndIdRoadmapId(user.getId(), rId);
            int totalNodes = (int) nodeRepository.countByRoadmapId(rId);
            int completedNodes = (int) userProgressRepository.countCompletedByUserIdAndRoadmapId(user.getId(), rId);

            if (!isEnrolled && completedNodes == 0) {
                continue;
            }

            int percent = totalNodes > 0 ? (int) Math.round((completedNodes * 100.0) / totalNodes) : 0;
            boolean isDone = totalNodes > 0 && completedNodes >= totalNodes;

            roadmapRepository.findById(rId).ifPresent(roadmap -> {
                ProgressRoadmapCardDto dto = ProgressRoadmapCardDto.builder()
                        .roadmapId(roadmap.getId())
                        .title(roadmap.getTitle())
                        .description(roadmap.getDescription())
                        .category(roadmap.getCategory())
                        .difficulty(roadmap.getDifficulty() != null ? roadmap.getDifficulty().name() : null)
                        .nodesCount(totalNodes)
                        .completedNodesCount(completedNodes)
                        .progressPercent(percent)
                        .rating(4.8)
                        .participantsCount(1)
                        .isCompleted(isDone)
                        .build();

                if (isDone) {
                    completed.add(dto);
                } else {
                    inProgress.add(dto);
                }
            });
        }

        return MyRoadmapsProgressResponse.builder()
                .inProgress(inProgress)
                .completed(completed)
                .build();
    }

    @Transactional(readOnly = true)
    public RoadmapProgressDetailResponse getRoadmapProgress(Long roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RoadmapNotFoundException(roadmapId));
        User user = currentUserProvider.getCurrentUser();

        boolean isEnrolled = enrollmentRepository.existsByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId());
        List<UserProgress> progressList = userProgressRepository.findAllByUserIdAndRoadmapId(user.getId(), roadmap.getId());

        List<Long> completedIds = progressList.stream()
                .filter(UserProgress::isCompleted)
                .map(up -> up.getNode().getId())
                .toList();

        int totalNodes = (int) nodeRepository.countByRoadmapId(roadmap.getId());
        int completedNodes = completedIds.size();
        int percent = totalNodes > 0 ? (int) Math.round((completedNodes * 100.0) / totalNodes) : 0;

        return RoadmapProgressDetailResponse.builder()
                .roadmapId(roadmap.getId())
                .isEnrolled(isEnrolled)
                .totalNodes(totalNodes)
                .completedNodes(completedNodes)
                .progressPercent(percent)
                .completedNodeIds(completedIds)
                .build();
    }

    public RoadmapProgressDetailResponse enroll(Long roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RoadmapNotFoundException(roadmapId));
        User user = currentUserProvider.getCurrentUser();

        if (!enrollmentRepository.existsByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId())) {
            UserRoadmapEnrollment enrollment = UserRoadmapEnrollment.builder()
                    .id(new UserRoadmapEnrollmentId(user.getId(), roadmap.getId()))
                    .user(user)
                    .roadmap(roadmap)
                    .enrolledAt(Instant.now())
                    .build();
            enrollmentRepository.save(enrollment);
        }

        return getRoadmapProgress(roadmapId);
    }

    public RoadmapProgressDetailResponse unenroll(Long roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RoadmapNotFoundException(roadmapId));
        User user = currentUserProvider.getCurrentUser();

        enrollmentRepository.deleteByIdUserIdAndIdRoadmapId(user.getId(), roadmap.getId());

        List<UserProgress> userProgressList = userProgressRepository.findAllByUserIdAndRoadmapId(user.getId(), roadmap.getId());
        if (!userProgressList.isEmpty()) {
            userProgressRepository.deleteAll(userProgressList);
        }

        return getRoadmapProgress(roadmapId);
    }

    public RoadmapProgressDetailResponse toggleNodeProgress(Long roadmapId, Long nodeId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RoadmapNotFoundException(roadmapId));
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new NodeNotFoundException(nodeId));

        if (!node.getRoadmap().getId().equals(roadmap.getId())) {
            throw new IllegalArgumentException("Узел не принадлежит указанной дорожной карте");
        }

        User user = currentUserProvider.getCurrentUser();

        var existingProgress = userProgressRepository
                .findByIdUserIdAndIdNodeId(user.getId(), node.getId());

        if (existingProgress.isPresent()) {
            UserProgress up = existingProgress.get();
            if (up.isCompleted()) {
                userProgressRepository.delete(up);
            } else {
                up.setCompleted(true);
                up.setCompletedAt(Instant.now());
                userProgressRepository.save(up);
            }
        } else {
            UserProgress newProgress = UserProgress.builder()
                    .id(new UserProgressId(user.getId(), node.getId()))
                    .user(user)
                    .node(node)
                    .isCompleted(true)
                    .completedAt(Instant.now())
                    .build();
            userProgressRepository.save(newProgress);
        }

        return getRoadmapProgress(roadmapId);
    }
}
