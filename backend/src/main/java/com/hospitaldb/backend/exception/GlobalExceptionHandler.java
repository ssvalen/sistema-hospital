package com.hospitaldb.backend.exception;

import com.hospitaldb.backend.dto.response.EntityResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<EntityResponse<Void>> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {

        log.error("Resource not found: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                EntityResponse.error(ex.getMessage(), request.getRequestURI(), HttpStatus.NOT_FOUND.value())
        );
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<EntityResponse<Void>> handleBusiness(
            BusinessException ex,
            HttpServletRequest request
    ) {

        log.error("Business error: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                EntityResponse.error(ex.getMessage(), request.getRequestURI(), HttpStatus.BAD_REQUEST.value())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<EntityResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        log.error("Validation error: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                EntityResponse.error("Error de validación", errors, request.getRequestURI(), HttpStatus.BAD_REQUEST.value())
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<EntityResponse<Void>> handleGeneric(
            Exception ex,
            HttpServletRequest request
    ) {

        log.error("Unexpected error: {}", ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                EntityResponse.error("Error interno del servidor", request.getRequestURI(), HttpStatus.INTERNAL_SERVER_ERROR.value())
        );
    }
}
