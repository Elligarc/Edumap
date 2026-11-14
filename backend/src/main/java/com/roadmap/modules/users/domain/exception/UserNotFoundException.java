package com.roadmap.modules.users.domain.exception;

import com.roadmap.common.exception.ResourceNotFoundException;

public class UserNotFoundException extends ResourceNotFoundException {

    public UserNotFoundException(Long id) {
        super("USER_NOT_FOUND", "Пользователь с id " + id + " не найден");
    }

    public UserNotFoundException(String message) {
        super("USER_NOT_FOUND", message);
    }
}
