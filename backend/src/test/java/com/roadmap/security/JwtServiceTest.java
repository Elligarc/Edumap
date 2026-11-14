package com.roadmap.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        jwtService = new JwtService(
                "super-secret-jwt-key-for-educational-roadmap-platform-2026-minimum-256-bits!",
                900000L,
                2592000000L,
                objectMapper
        );
    }

    @Test
    void shouldGenerateAndValidateAccessToken() {
        String token = jwtService.generateAccessToken(42L, "test@example.com", "Test User");

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractUserId(token)).isEqualTo(42L);
        assertThat(jwtService.extractEmail(token)).isEqualTo("test@example.com");
        assertThat(jwtService.extractName(token)).isEqualTo("Test User");
    }

    @Test
    void shouldRejectInvalidToken() {
        assertThat(jwtService.isTokenValid("invalid.jwt.token")).isFalse();
        assertThat(jwtService.isTokenValid("")).isFalse();
    }

    @Test
    void shouldGenerateRefreshTokenString() {
        String refreshToken = jwtService.generateRefreshTokenString();
        assertThat(refreshToken).isNotBlank();
        assertThat(refreshToken.length()).isGreaterThan(30);
    }
}
