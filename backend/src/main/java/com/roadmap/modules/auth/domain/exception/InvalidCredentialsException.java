package com.roadmap.modules.auth.domain.exception;

public class InvalidCredentialsException extends RuntimeException {

    private final String code = "INVALID_CREDENTIALS";

    public InvalidCredentialsException() {
        super("Неверный email или пароль");
    }

    public String getCode() {
        return code;
    }
}
