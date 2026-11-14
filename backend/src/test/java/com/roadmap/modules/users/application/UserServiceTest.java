package com.roadmap.modules.users.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.modules.auth.domain.exception.EmailAlreadyExistsException;
import com.roadmap.modules.users.api.dto.ChangePasswordRequest;
import com.roadmap.modules.users.api.dto.UpdateProfileRequest;
import com.roadmap.modules.users.api.dto.UserProfileResponse;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void shouldReturnUserProfile() {
        User user = User.builder()
                .id(1L)
                .name("Олег")
                .email("oleg@mail.ru")
                .createdAt(Instant.now())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserProfileResponse response = userService.getProfile(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Олег");
        assertThat(response.email()).isEqualTo("oleg@mail.ru");
    }

    @Test
    void shouldUpdateProfileSuccessfully() {
        User user = User.builder()
                .id(1L)
                .name("Олег")
                .email("oleg@mail.ru")
                .createdAt(Instant.now())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail("new-email@mail.ru")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest request = new UpdateProfileRequest("Олег Иванов", "new-email@mail.ru");
        UserProfileResponse response = userService.updateProfile(1L, request);

        assertThat(response.name()).isEqualTo("Олег Иванов");
        assertThat(response.email()).isEqualTo("new-email@mail.ru");
    }

    @Test
    void shouldThrowIfUpdatedEmailAlreadyTaken() {
        User user = User.builder()
                .id(1L)
                .name("Олег")
                .email("oleg@mail.ru")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail("taken@mail.ru")).thenReturn(true);

        UpdateProfileRequest request = new UpdateProfileRequest("Олег", "taken@mail.ru");

        assertThatThrownBy(() -> userService.updateProfile(1L, request))
                .isInstanceOf(EmailAlreadyExistsException.class);
    }

    @Test
    void shouldChangePasswordSuccessfully() {
        User user = User.builder()
                .id(1L)
                .password("old-hash")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("oldPass123", "old-hash")).thenReturn(true);
        when(passwordEncoder.matches("newPass123", "old-hash")).thenReturn(false);
        when(passwordEncoder.encode("newPass123")).thenReturn("new-hash");

        ChangePasswordRequest request = new ChangePasswordRequest("oldPass123", "newPass123");
        userService.changePassword(1L, request);

        assertThat(user.getPassword()).isEqualTo("new-hash");
        verify(userRepository).save(user);
    }

    @Test
    void shouldThrowOnWrongCurrentPassword() {
        User user = User.builder()
                .id(1L)
                .password("old-hash")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPass", "old-hash")).thenReturn(false);

        ChangePasswordRequest request = new ChangePasswordRequest("wrongPass", "newPass123");

        assertThatThrownBy(() -> userService.changePassword(1L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Текущий пароль указан неверно");
    }
}
