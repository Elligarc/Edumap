package com.roadmap.modules.users.api;

import com.roadmap.modules.users.api.dto.ChangePasswordRequest;
import com.roadmap.modules.users.api.dto.UpdateProfileRequest;
import com.roadmap.modules.users.api.dto.UserProfileResponse;
import com.roadmap.modules.users.application.UserService;
import com.roadmap.security.SecurityUserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Пользователи", description = "Управление профилем текущего пользователя")
@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Получить профиль текущего пользователя")
    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        return ResponseEntity.ok(userService.getProfile(principal.id()));
    }

    @Operation(summary = "Обновить личные данные (имя, email)")
    @PatchMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(principal.id(), request));
    }

    @Operation(summary = "Сменить пароль")
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(principal.id(), request);
        return ResponseEntity.noContent().build();
    }
}
