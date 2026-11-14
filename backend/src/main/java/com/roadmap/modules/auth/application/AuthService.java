package com.roadmap.modules.auth.application;

import com.roadmap.modules.auth.api.dto.AuthResponse;
import com.roadmap.modules.auth.api.dto.LoginRequest;
import com.roadmap.modules.auth.api.dto.RegisterRequest;
import com.roadmap.modules.auth.api.dto.UserSummaryResponse;
import com.roadmap.modules.auth.domain.exception.EmailAlreadyExistsException;
import com.roadmap.modules.auth.domain.exception.InvalidCredentialsException;
import com.roadmap.modules.auth.domain.exception.InvalidTokenException;
import com.roadmap.modules.auth.domain.model.RefreshToken;
import com.roadmap.modules.auth.domain.repository.RefreshTokenRepository;
import com.roadmap.modules.users.domain.model.User;
import com.roadmap.modules.users.domain.repository.UserRepository;
import com.roadmap.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public record AuthResult(AuthResponse response, String refreshToken) {
    }

    @Transactional
    public AuthResult register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        // TODO: email confirmation

        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user with id={} and email={}", savedUser.getId(), savedUser.getEmail());

        return createSession(savedUser);
    }

    @Transactional
    public AuthResult login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Failed login attempt for user email={}", request.email());
            throw new InvalidCredentialsException();
        }

        log.info("User id={} logged in successfully", user.getId());
        return createSession(user);
    }

    @Transactional
    public AuthResult refresh(String refreshTokenString) {
        if (refreshTokenString == null || refreshTokenString.isBlank()) {
            throw new InvalidTokenException("Refresh токен отсутствует");
        }

        String tokenHash = hashToken(refreshTokenString);
        RefreshToken token = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Refresh токен не найден или недействителен"));

        if (!token.isValid()) {
            log.warn("Attempt to use revoked/expired refresh token id={}", token.getId());
            throw new InvalidTokenException("Refresh токен истёк или был отозван");
        }

        token.setRevoked(true);
        refreshTokenRepository.save(token);

        User user = token.getUser();
        return createSession(user);
    }

    @Transactional
    public void logout(String refreshTokenString) {
        if (refreshTokenString != null && !refreshTokenString.isBlank()) {
            String tokenHash = hashToken(refreshTokenString);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
                log.info("Revoked refresh token for user id={}", token.getUser().getId());
            });
        }
    }

    private AuthResult createSession(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getName());
        String refreshTokenString = jwtService.generateRefreshTokenString();

        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs());
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(refreshTokenString))
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        UserSummaryResponse userSummary = new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        return new AuthResult(new AuthResponse(userSummary, accessToken), refreshTokenString);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
