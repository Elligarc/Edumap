package com.roadmap.modules.auth.domain.exception;

public class InvalidTokenException extends RuntimeException {

    private final String code = "INVALID_TOKEN";

    public InvalidTokenException(String message) {
        super(message);
    }

    public String getCode() {
        return code;
    }
}
