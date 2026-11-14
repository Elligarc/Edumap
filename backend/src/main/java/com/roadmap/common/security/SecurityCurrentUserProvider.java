package com.roadmap.common.security;

import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import com.roadmap.security.SecurityUserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Primary
@Component
@RequiredArgsConstructor
public class SecurityCurrentUserProvider implements CurrentUserProvider {

    private final UserRepository userRepository;
    private final DemoCurrentUserProvider demoCurrentUserProvider;

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUserPrincipal principal) {
            return userRepository.findById(principal.id())
                    .orElseGet(demoCurrentUserProvider::getCurrentUser);
        }
        return demoCurrentUserProvider.getCurrentUser();
    }

    @Override
    public java.util.Optional<User> getCurrentUserOptional() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof SecurityUserPrincipal principal) {
            return userRepository.findById(principal.id());
        }
        return java.util.Optional.empty();
    }
}
