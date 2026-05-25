package com.mealplanner.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception exception) {

        logger.error("Unhandled exception", exception);

        return switch (exception) {
            case IllegalArgumentException illegalArgumentException -> {
                logger.warn("Bad request", exception);

                yield ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiError("Invalid request data"));
            }

            case AuthenticationException authenticationException -> {
                logger.warn("Unauthorized", exception);

                yield ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiError("Authentication required"));
            }

            case AccessDeniedException accessDeniedException -> {
                logger.warn("Access denied", exception);

                yield ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiError("Access denied"));
            }

            default -> {
                logger.error("Internal server error", exception);

                yield ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiError("Internal server error"));
            }
        };
    }
}
