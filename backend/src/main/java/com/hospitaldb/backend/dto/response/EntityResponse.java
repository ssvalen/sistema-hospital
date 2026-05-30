package com.hospitaldb.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntityResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Object metadata;
    private LocalDateTime timestamp;
    private String path;
    private Integer statusCode;

    public static <T> EntityResponse<T> success(T data, String message, String path) {
        return EntityResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .path(path)
                .statusCode(200)
                .build();
    }

    public static <T> EntityResponse<T> success(String message, String path) {
        return EntityResponse.<T>builder()
                .success(true)
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .statusCode(200)
                .build();
    }

    public static <T> EntityResponse<T> success(T data, String message, Object metadata, String path) {
        return EntityResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .metadata(metadata)
                .timestamp(LocalDateTime.now())
                .path(path)
                .statusCode(200)
                .build();
    }

    public static <T> EntityResponse<T> error(String message, String path, Integer statusCode) {
        return EntityResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .statusCode(statusCode)
                .build();
    }

    public static <T> EntityResponse<T> error(String message, T errors, String path, Integer statusCode) {
        return EntityResponse.<T>builder()
                .success(false)
                .message(message)
                .data(errors)
                .timestamp(LocalDateTime.now())
                .path(path)
                .statusCode(statusCode)
                .build();
    }
}
