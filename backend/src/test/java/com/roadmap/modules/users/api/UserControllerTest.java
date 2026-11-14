package com.roadmap.modules.users.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.users.api.dto.ChangePasswordRequest;
import com.roadmap.modules.users.api.dto.UpdateProfileRequest;
import com.roadmap.modules.users.api.dto.UserProfileResponse;
import com.roadmap.modules.users.application.UserService;
import com.roadmap.security.SecurityUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        HandlerMethodArgumentResolver principalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.getParameterType().isAssignableFrom(SecurityUserPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                return new SecurityUserPrincipal(1L, "Олег", "oleg@mail.ru", "");
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setCustomArgumentResolvers(principalResolver)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldReturnProfile() throws Exception {
        UserProfileResponse response = new UserProfileResponse(1L, "Олег", "oleg@mail.ru", Instant.now());
        when(userService.getProfile(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Олег"))
                .andExpect(jsonPath("$.email").value("oleg@mail.ru"));
    }

    @Test
    void shouldUpdateProfile() throws Exception {
        UserProfileResponse response = new UserProfileResponse(1L, "Олег Иванов", "new@mail.ru", Instant.now());
        when(userService.updateProfile(eq(1L), any(UpdateProfileRequest.class))).thenReturn(response);

        mockMvc.perform(patch("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Олег Иванов",
                                  "email": "new@mail.ru"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Олег Иванов"))
                .andExpect(jsonPath("$.email").value("new@mail.ru"));
    }

    @Test
    void shouldChangePassword() throws Exception {
        mockMvc.perform(put("/api/v1/users/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentPassword": "oldPassword123",
                                  "newPassword": "newPassword123"
                                }
                                """))
                .andExpect(status().isNoContent());

        verify(userService).changePassword(eq(1L), any(ChangePasswordRequest.class));
    }
}
