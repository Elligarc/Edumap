package com.roadmap.modules.auth.api;

import com.roadmap.modules.auth.api.dto.AuthResponse;
import com.roadmap.modules.auth.api.dto.LoginRequest;
import com.roadmap.modules.auth.api.dto.RegisterRequest;
import com.roadmap.modules.auth.api.dto.TokenRefreshResponse;
import com.roadmap.modules.auth.application.AuthService;
import com.roadmap.modules.auth.application.AuthService.AuthResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@Tag(name = "Аутентификация", description = "Регистрация, вход, обновление сессии и выход")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_COOKIE_NAME = "refreshToken";
    private static final long REFRESH_COOKIE_MAX_AGE_SECONDS = 30L * 24 * 60 * 60; // 30 дней
    private final AuthService authService;

    @Operation(summary = "Регистрация нового пользователя")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResult result = authService.register(request);
        return buildResponseWithCookie(HttpStatus.CREATED, result.response(), result.refreshToken(), REFRESH_COOKIE_MAX_AGE_SECONDS);
    }

    @Operation(summary = "Вход в систему по email и паролю")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResult result = authService.login(request);
        return buildResponseWithCookie(HttpStatus.OK, result.response(), result.refreshToken(), REFRESH_COOKIE_MAX_AGE_SECONDS);
    }

    @Operation(summary = "Обновление access токена через refresh cookie")
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refresh(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken
    ) {
        AuthResult result = authService.refresh(refreshToken);
        return buildResponseWithCookie(
                HttpStatus.OK,
                new TokenRefreshResponse(result.response().accessToken()),
                result.refreshToken(),
                REFRESH_COOKIE_MAX_AGE_SECONDS
        );
    }

    @Operation(summary = "Выход из системы (отзыв refresh токена)")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken
    ) {
        authService.logout(refreshToken);
        return buildResponseWithCookie(HttpStatus.NO_CONTENT, null, "", 0);
    }

    private <T> ResponseEntity<T> buildResponseWithCookie(HttpStatus status, T body, String token, long maxAgeSeconds) {
        ResponseCookie cookie = createRefreshCookie(token, maxAgeSeconds);
        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(body);
    }

    private ResponseCookie createRefreshCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/v1/auth")
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
    }
}
