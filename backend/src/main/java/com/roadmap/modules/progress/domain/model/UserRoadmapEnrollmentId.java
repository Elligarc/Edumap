package com.roadmap.modules.progress.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserRoadmapEnrollmentId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "roadmap_id")
    private Long roadmapId;
}
