package com.roadmap.modules.auth.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.auth.api.dto.AuthResponse;
import com.roadmap.modules.auth.api.dto.LoginRequest;
import com.roadmap.modules.auth.api.dto.RegisterRequest;
import com.roadmap.modules.auth.api.dto.UserSummaryResponse;
import com.roadmap.modules.auth.application.AuthService;
import com.roadmap.modules.auth.domain.exception.EmailAlreadyExistsException;
import com.roadmap.modules.auth.domain.exception.InvalidCredentialsException;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldRegisterSuccessfully() throws Exception {
        UserSummaryResponse userSummary = new UserSummaryResponse(1L, "Иван", "ivan@example.com");
        AuthResponse response = new AuthResponse(userSummary, "test-access-token");
        AuthService.AuthResult result = new AuthService.AuthResult(response, "test-refresh-token");

        when(authService.register(any(RegisterRequest.class))).thenReturn(result);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Иван",
                                  "email": "ivan@example.com",
                                  "password": "Password123"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("test-access-token"))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.name").value("Иван"))
                .andExpect(jsonPath("$.user.email").value("ivan@example.com"))
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(cookie().value("refreshToken", "test-refresh-token"))
                .andExpect(cookie().httpOnly("refreshToken", true));
    }

    @Test
    void shouldReturnConflictWhenEmailExists() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new EmailAlreadyExistsException("ivan@example.com"));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Иван",
                                  "email": "ivan@example.com",
                                  "password": "Password123"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("EMAIL_ALREADY_EXISTS"));
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        UserSummaryResponse userSummary = new UserSummaryResponse(1L, "Иван", "ivan@example.com");
        AuthResponse response = new AuthResponse(userSummary, "test-access-token");
        AuthService.AuthResult result = new AuthService.AuthResult(response, "test-refresh-token");

        when(authService.login(any(LoginRequest.class))).thenReturn(result);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "ivan@example.com",
                                  "password": "Password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("test-access-token"))
                .andExpect(cookie().value("refreshToken", "test-refresh-token"));
    }

    @Test
    void shouldReturnUnauthorizedOnInvalidCredentials() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "ivan@example.com",
                                  "password": "WrongPassword"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    void shouldRefreshSessionSuccessfully() throws Exception {
        UserSummaryResponse userSummary = new UserSummaryResponse(1L, "Иван", "ivan@example.com");
        AuthResponse response = new AuthResponse(userSummary, "new-access-token");
        AuthService.AuthResult result = new AuthService.AuthResult(response, "new-refresh-token");

        when(authService.refresh("my-cookie-token")).thenReturn(result);

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", "my-cookie-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(cookie().value("refreshToken", "new-refresh-token"));
    }

    @Test
    void shouldLogoutSuccessfully() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout")
                        .cookie(new Cookie("refreshToken", "my-cookie-token")))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge("refreshToken", 0));

        verify(authService).logout("my-cookie-token");
    }
}
