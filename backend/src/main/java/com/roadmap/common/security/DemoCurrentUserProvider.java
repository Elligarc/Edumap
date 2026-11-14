package com.roadmap.common.security;

import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Component
@RequiredArgsConstructor
public class DemoCurrentUserProvider implements CurrentUserProvider {
    private final PasswordEncoder passwordEncoder;

    public static final String DEMO_NAME = "demo_author";
    public static final String DEMO_EMAIL = "author@mail.ru";
    public static final String DEMO_PASSWORD = "123";

    private final UserRepository userRepository;

    @Override
    @Transactional
    public User getCurrentUser() {
        return userRepository.findByEmail(DEMO_EMAIL)
                .orElseGet(this::createDemoUser);
    }

    private User createDemoUser() {
        log.info("Creating default demo user with email '{}'", DEMO_EMAIL);
        User demoUser = User.builder()
                .name(DEMO_NAME)
                .email(DEMO_EMAIL)
                .password(passwordEncoder.encode(DEMO_PASSWORD))
                .build();
        return userRepository.save(demoUser);
    }
}
