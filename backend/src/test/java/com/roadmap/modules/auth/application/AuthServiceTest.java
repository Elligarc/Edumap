package com.roadmap.modules.auth.application;

import com.roadmap.modules.auth.api.dto.LoginRequest;
import com.roadmap.modules.auth.api.dto.RegisterRequest;
import com.roadmap.modules.auth.domain.exception.EmailAlreadyExistsException;
import com.roadmap.modules.auth.domain.exception.InvalidCredentialsException;
import com.roadmap.modules.auth.domain.exception.InvalidTokenException;
import com.roadmap.modules.auth.domain.model.RefreshToken;
import com.roadmap.modules.auth.domain.repository.RefreshTokenRepository;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import com.roadmap.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, refreshTokenRepository, passwordEncoder, jwtService);
    }

    @Test
    void shouldRegisterNewUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("Иван", "ivan@example.com", "Password123");

        when(userRepository.existsByEmail("ivan@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(10L);
            return u;
        });
        when(jwtService.generateAccessToken(eq(10L), eq("ivan@example.com"), eq("Иван"))).thenReturn("access-token");
        when(jwtService.generateRefreshTokenString()).thenReturn("refresh-token-string");
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(2592000000L);

        AuthService.AuthResult result = authService.register(request);

        assertThat(result.response().accessToken()).isEqualTo("access-token");
        assertThat(result.response().user().id()).isEqualTo(10L);
        assertThat(result.response().user().email()).isEqualTo("ivan@example.com");
        assertThat(result.response().user().name()).isEqualTo("Иван");
        assertThat(result.refreshToken()).isEqualTo("refresh-token-string");

        ArgumentCaptor<RefreshToken> tokenCaptor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(tokenCaptor.capture());
        assertThat(tokenCaptor.getValue().getUser().getId()).isEqualTo(10L);
        assertThat(tokenCaptor.getValue().isRevoked()).isFalse();
    }

    @Test
    void shouldThrowWhenRegisteringExistingEmail() {
        RegisterRequest request = new RegisterRequest("Иван", "ivan@example.com", "Password123");
        when(userRepository.existsByEmail("ivan@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("ivan@example.com");
    }

    @Test
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("ivan@example.com", "Password123");
        User user = User.builder()
                .id(10L)
                .name("Иван")
                .email("ivan@example.com")
                .password("encoded-password")
                .build();

        when(userRepository.findByEmail("ivan@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123", "encoded-password")).thenReturn(true);
        when(jwtService.generateAccessToken(10L, "ivan@example.com", "Иван")).thenReturn("access-token");
        when(jwtService.generateRefreshTokenString()).thenReturn("refresh-token-string");
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(2592000000L);

        AuthService.AuthResult result = authService.login(request);

        assertThat(result.response().accessToken()).isEqualTo("access-token");
        assertThat(result.response().user().email()).isEqualTo("ivan@example.com");
    }

    @Test
    void shouldThrowInvalidCredentialsOnWrongPassword() {
        LoginRequest request = new LoginRequest("ivan@example.com", "WrongPassword");
        User user = User.builder()
                .id(10L)
                .email("ivan@example.com")
                .password("encoded-password")
                .build();

        when(userRepository.findByEmail("ivan@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "encoded-password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void shouldThrowOnRefreshWithoutToken() {
        assertThatThrownBy(() -> authService.refresh(null))
                .isInstanceOf(InvalidTokenException.class);
        assertThatThrownBy(() -> authService.refresh("   "))
                .isInstanceOf(InvalidTokenException.class);
    }

    @Test
    void shouldRefreshSessionSuccessfully() {
        User user = User.builder().id(10L).name("Иван").email("ivan@example.com").build();
        RefreshToken oldToken = RefreshToken.builder()
                .id(1L)
                .user(user)
                .tokenHash("hash")
                .expiresAt(Instant.now().plusSeconds(3600))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(oldToken));
        when(jwtService.generateAccessToken(10L, "ivan@example.com", "Иван")).thenReturn("new-access-token");
        when(jwtService.generateRefreshTokenString()).thenReturn("new-refresh-token");
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(2592000000L);

        AuthService.AuthResult result = authService.refresh("valid-raw-token");

        assertThat(oldToken.isRevoked()).isTrue();
        assertThat(result.response().accessToken()).isEqualTo("new-access-token");
        assertThat(result.refreshToken()).isEqualTo("new-refresh-token");
    }
}
