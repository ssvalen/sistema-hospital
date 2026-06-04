package com.hospitaldb.backend.exception;

public class KeycloakException extends RuntimeException {

    private final int statusCode;
    private final String keycloakError;

    public KeycloakException(String message) {
        super(message);
        this.statusCode = 0;
        this.keycloakError = null;
    }

    public KeycloakException(String message, int statusCode, String keycloakError) {
        super(message);
        this.statusCode = statusCode;
        this.keycloakError = keycloakError;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getKeycloakError() {
        return keycloakError;
    }
}