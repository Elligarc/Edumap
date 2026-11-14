package com.roadmap.common.security;

import com.roadmap.modules.users.domain.model.User;

import java.util.Optional;

public interface CurrentUserProvider {

    User getCurrentUser();

    default Optional<User> getCurrentUserOptional() {
        return Optional.ofNullable(getCurrentUser());
    }
}
