package com.roadmap.modules.users.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.modules.users.domain.exception.UserNotFoundException;
import com.roadmap.modules.auth.domain.exception.EmailAlreadyExistsException;
import com.roadmap.modules.users.api.dto.ChangePasswordRequest;
import com.roadmap.modules.users.api.dto.UpdateProfileRequest;
import com.roadmap.modules.users.api.dto.UserProfileResponse;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = getUserOrThrow(userId);
        return mapToResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserOrThrow(userId);

        if (StringUtils.hasText(request.name())) {
            user.setName(request.name().trim());
        }

        if (StringUtils.hasText(request.email())) {
            String newEmail = request.email().trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new EmailAlreadyExistsException(newEmail);
                }
                // TODO: email confirmation
                user.setEmail(newEmail);
            }
        }

        User updatedUser = userRepository.save(user);
        log.info("Updated profile for user id={}", updatedUser.getId());
        return mapToResponse(updatedUser);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserOrThrow(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BusinessRuleException("INVALID_CURRENT_PASSWORD", "Текущий пароль указан неверно");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new BusinessRuleException("SAME_PASSWORD", "Новый пароль не должен совпадать с текущим");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user id={}", user.getId());
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    private UserProfileResponse mapToResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
