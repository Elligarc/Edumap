package com.roadmap.common.exception;

public abstract class ResourceNotFoundException extends RuntimeException {

    private final String code;

    protected ResourceNotFoundException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
