package com.roadmap.modules.roadmaps.application;

import com.roadmap.common.dto.PageResponse;
import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.comments.domain.repository.CommentRepository;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.progress.domain.repository.UserRoadmapEnrollmentRepository;
import com.roadmap.modules.roadmaps.api.dto.CreateRoadmapRequest;
import com.roadmap.modules.roadmaps.api.dto.RoadmapResponse;
import com.roadmap.modules.roadmaps.api.dto.UpdateRoadmapRequest;
import com.roadmap.modules.roadmaps.application.mapper.RoadmapMapper;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapAccessDeniedException;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapNotFoundException;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapCountProjection;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats;
import com.roadmap.modules.users.domain.model.User;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final NodeRepository nodeRepository;
    private final UserRoadmapEnrollmentRepository enrollmentRepository;
    private final CommentRepository commentRepository;
    private final RoadmapMapper roadmapMapper;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public RoadmapResponse createRoadmap(CreateRoadmapRequest request) {
        User author = currentUserProvider.getCurrentUser();
        Roadmap roadmap = roadmapMapper.toEntity(request, author);
        Roadmap saved = roadmapRepository.save(roadmap);
        log.info("Created roadmap with id={} by author={}", saved.getId(), author.getName());
        return roadmapMapper.toResponse(saved, 0L, null, 0L, 0L);
    }

    public RoadmapResponse getRoadmapById(Long id) {
        Roadmap roadmap = findRoadmapOrThrow(id);
        validateRoadmapAccess(roadmap);
        Integer currentUserRating = currentUserProvider.getCurrentUserOptional()
                .flatMap(user -> commentRepository.findByRoadmapIdAndAuthorId(id, user.getId()))
                .map(Comment::getRating)
                .orElse(null);
        return toResponseWithStats(roadmap, currentUserRating);
    }

    public void validateRoadmapAccess(Roadmap roadmap) {
        if (roadmap.getVisibility() == RoadmapVisibility.PRIVATE) {
            User currentUser = currentUserProvider.getCurrentUserOptional().orElse(null);
            if (currentUser == null || !roadmap.getAuthor().getId().equals(currentUser.getId())) {
                throw new RoadmapAccessDeniedException(roadmap.getId());
            }
        }
    }

    public PageResponse<RoadmapResponse> getRoadmaps(
            String search,
            String category,
            RoadmapDifficulty difficulty,
            RoadmapVisibility visibility,
            Pageable pageable
    ) {
        Specification<Roadmap> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }
            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            if (visibility != null) {
                if (visibility == RoadmapVisibility.PRIVATE) {
                    predicates.add(cb.disjunction());
                } else {
                    predicates.add(cb.equal(root.get("visibility"), visibility));
                }
            } else {
                predicates.add(cb.equal(root.get("visibility"), RoadmapVisibility.PUBLISHED));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Roadmap> page = roadmapRepository.findAll(spec, pageable);
        List<RoadmapResponse> responses = toResponsesWithStats(page.getContent());
        Page<RoadmapResponse> responsePage = new PageImpl<>(responses, pageable, page.getTotalElements());
        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public List<RoadmapResponse> getMyRoadmaps() {
        User currentUser = currentUserProvider.getCurrentUser();
        return toResponsesWithStats(roadmapRepository.findAllByAuthorId(currentUser.getId()));
    }

    @Transactional
    public RoadmapResponse updateRoadmap(Long id, UpdateRoadmapRequest request) {
        Roadmap roadmap = findRoadmapOrThrow(id);

        if (request.title() != null && !request.title().isBlank()) {
            roadmap.setTitle(request.title().trim());
        }
        if (request.description() != null) {
            roadmap.setDescription(request.description());
        }
        if (request.category() != null) {
            roadmap.setCategory(request.category().isBlank() ? null : request.category().trim());
        }
        if (request.difficulty() != null) {
            roadmap.setDifficulty(request.difficulty());
        }
        if (request.price() != null) {
            roadmap.setPrice(request.price());
        }
        if (request.visibility() != null) {
            roadmap.setVisibility(request.visibility());
        }

        Roadmap updated = roadmapRepository.save(roadmap);
        log.info("Updated roadmap id={}", id);
        return toResponseWithStats(updated);
    }

    @Transactional
    public void deleteRoadmap(Long id) {
        Roadmap roadmap = findRoadmapOrThrow(id);
        roadmapRepository.delete(roadmap);
        log.info("Deleted roadmap id={}", id);
    }

    @Transactional
    public RoadmapResponse publishRoadmap(Long id) {
        return updateRoadmapVisibility(id, RoadmapVisibility.PUBLISHED, "Published");
    }

    @Transactional
    public RoadmapResponse hideRoadmap(Long id) {
        return updateRoadmapVisibility(id, RoadmapVisibility.HIDDEN, "Hidden");
    }

    public Roadmap findRoadmapOrThrow(Long id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() -> new RoadmapNotFoundException(id));
    }

    private RoadmapResponse updateRoadmapVisibility(Long id, RoadmapVisibility visibility, String actionLog) {
        Roadmap roadmap = findRoadmapOrThrow(id);
        roadmap.setVisibility(visibility);
        Roadmap updated = roadmapRepository.save(roadmap);
        log.info("{} roadmap id={}", actionLog, id);
        return toResponseWithStats(updated);
    }

    private RoadmapResponse toResponseWithStats(Roadmap roadmap) {
        return toResponseWithStats(roadmap, null);
    }

    private RoadmapResponse toResponseWithStats(Roadmap roadmap, Integer currentUserRating) {
        List<RoadmapResponse> responses = toResponsesWithStats(List.of(roadmap), currentUserRating);
        return responses.get(0);
    }

    private List<RoadmapResponse> toResponsesWithStats(List<Roadmap> roadmaps) {
        return toResponsesWithStats(roadmaps, null);
    }

    private List<RoadmapResponse> toResponsesWithStats(List<Roadmap> roadmaps, Integer singleCurrentUserRating) {
        if (roadmaps.isEmpty()) {
            return List.of();
        }

        List<Long> ids = roadmaps.stream().map(Roadmap::getId).toList();

        Map<Long, Long> nodesMap = nodeRepository.countNodesByRoadmapIds(ids).stream()
                .collect(Collectors.toMap(RoadmapCountProjection::roadmapId, RoadmapCountProjection::count));

        Map<Long, Long> studentsMap = enrollmentRepository.countStudentsByRoadmapIds(ids).stream()
                .collect(Collectors.toMap(RoadmapCountProjection::roadmapId, RoadmapCountProjection::count));

        Map<Long, RoadmapRatingStats> ratingsMap = commentRepository.findRatingStatsByRoadmapIds(ids).stream()
                .collect(Collectors.toMap(RoadmapRatingStats::roadmapId, stats -> stats));

        return roadmaps.stream().map(roadmap -> {
            Long id = roadmap.getId();
            long nodesCount = nodesMap.getOrDefault(id, 0L);
            long studentsCount = studentsMap.getOrDefault(id, 0L);
            RoadmapRatingStats ratingStats = ratingsMap.get(id);
            Double rating = ratingStats != null ? ratingStats.getRoundedAverage() : null;
            long ratingsCount = ratingStats != null ? ratingStats.ratingsCount() : 0L;

            return roadmapMapper.toResponse(
                    roadmap,
                    nodesCount,
                    rating,
                    ratingsCount,
                    studentsCount,
                    singleCurrentUserRating
            );
        }).toList();
    }
}

