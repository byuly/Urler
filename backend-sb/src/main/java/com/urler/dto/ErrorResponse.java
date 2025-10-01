package com.urler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standardized error response format for API errors.
 * Provides consistent error information to clients including timestamp,
 * status code, error message, and request path.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    /**
     * Timestamp when the error occurred
     */
    private LocalDateTime timestamp;

    /**
     * HTTP status code
     */
    private int status;

    /**
     * Error type/category
     */
    private String error;

    /**
     * Detailed error message
     */
    private String message;

    /**
     * Request path that caused the error
     */
    private String path;

    /**
     * List of validation errors (optional, for validation failures)
     */
    private List<String> details;

    /**
     * Constructor for simple errors without validation details
     */
    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
