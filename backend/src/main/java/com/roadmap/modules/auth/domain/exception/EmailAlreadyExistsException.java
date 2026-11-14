package com.roadmap.modules.auth.domain.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    private final String code = "EMAIL_ALREADY_EXISTS";

    public EmailAlreadyExistsException(String email) {
        super("Пользователь с email '" + email + "' уже зарегистрирован");
    }

    public String getCode() {
        return code;
    }
}
