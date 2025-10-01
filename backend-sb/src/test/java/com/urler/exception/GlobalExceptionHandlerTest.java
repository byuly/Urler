package com.urler.exception;

import com.urler.dto.ErrorResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for GlobalExceptionHandler.
 * Tests all exception handling methods to ensure proper error responses.
 */
@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;
    private WebRequest webRequest;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
        webRequest = mock(WebRequest.class);
        when(webRequest.getDescription(false)).thenReturn("uri=/test/path");
    }

    @Test
    @DisplayName("Should handle AliasAlreadyExistsException and return 409 CONFLICT")
    void testHandleAliasAlreadyExists() {
        // create test exception with duplicate alias message
        String errorMessage = "Custom alias 'test123' is already taken.";
        AliasAlreadyExistsException exception = new AliasAlreadyExistsException(errorMessage);

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleAliasAlreadyExists(exception, webRequest);

        // verify response is 409 conflict
        assertNotNull(response);
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());

        // verify error response body has correct fields
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(409, errorResponse.getStatus());
        assertEquals("Conflict", errorResponse.getError());
        assertEquals(errorMessage, errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should handle ResourceNotFoundException and return 404 NOT FOUND")
    void testHandleResourceNotFound() {
        // create test exception for missing url
        String errorMessage = "URL 'nonexistent' not found.";
        ResourceNotFoundException exception = new ResourceNotFoundException(errorMessage);

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleResourceNotFound(exception, webRequest);

        // verify response is 404 not found
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // verify error response body
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(404, errorResponse.getStatus());
        assertEquals("Not Found", errorResponse.getError());
        assertEquals(errorMessage, errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException and return 400 BAD REQUEST with validation details")
    void testHandleValidationErrors() {
        // create mock validation errors
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError1 = new FieldError("urlDto", "url", "URL is required");
        FieldError fieldError2 = new FieldError("urlDto", "customAlias", "Alias must be 3-20 characters");
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));

        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(null, bindingResult);

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleValidationErrors(exception, webRequest);

        // verify response is 400 bad request
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // verify error response contains validation details
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(400, errorResponse.getStatus());
        assertEquals("Validation Failed", errorResponse.getError());
        assertEquals("Request validation failed. Please check the details.", errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getDetails());
        assertEquals(2, errorResponse.getDetails().size());
        assertTrue(errorResponse.getDetails().contains("url: URL is required"));
        assertTrue(errorResponse.getDetails().contains("customAlias: Alias must be 3-20 characters"));
    }

    @Test
    @DisplayName("Should handle AccessDeniedException and return 403 FORBIDDEN")
    void testHandleAccessDenied() {
        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleAccessDenied(webRequest);

        // verify response is 403 forbidden
        assertNotNull(response);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());

        // verify error response body
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(403, errorResponse.getStatus());
        assertEquals("Forbidden", errorResponse.getError());
        assertEquals("You do not have permission to access this resource.", errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should handle BadCredentialsException and return 401 UNAUTHORIZED")
    void testHandleBadCredentials() {
        // create bad credentials exception
        BadCredentialsException exception = new BadCredentialsException("Bad credentials");

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleBadCredentials(exception, webRequest);

        // verify response is 401 unauthorized
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        // verify error response body
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(401, errorResponse.getStatus());
        assertEquals("Unauthorized", errorResponse.getError());
        assertEquals("Invalid username or password.", errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should handle IllegalArgumentException and return 400 BAD REQUEST")
    void testHandleIllegalArgument() {
        // create illegal argument exception
        String errorMessage = "Invalid parameter provided";
        IllegalArgumentException exception = new IllegalArgumentException(errorMessage);

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleIllegalArgument(exception, webRequest);

        // verify response is 400 bad request
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        // verify error response body
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(400, errorResponse.getStatus());
        assertEquals("Bad Request", errorResponse.getError());
        assertEquals(errorMessage, errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should handle generic Exception and return 500 INTERNAL SERVER ERROR")
    void testHandleGlobalException() {
        // create generic runtime exception
        Exception exception = new RuntimeException("Unexpected error");

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleGlobalException(exception, webRequest);

        // verify response is 500 internal server error
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        // verify error response body
        ErrorResponse errorResponse = response.getBody();
        assertNotNull(errorResponse);
        assertEquals(500, errorResponse.getStatus());
        assertEquals("Internal Server Error", errorResponse.getError());
        assertEquals("An unexpected error occurred. Please try again later.", errorResponse.getMessage());
        assertEquals("/test/path", errorResponse.getPath());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    @DisplayName("Should extract correct path from WebRequest")
    void testPathExtraction() {
        // mock different request path
        when(webRequest.getDescription(false)).thenReturn("uri=/api/urls/shorten");
        ResourceNotFoundException exception = new ResourceNotFoundException("Test");

        // call exception handler
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleResourceNotFound(exception, webRequest);

        // verify path was extracted correctly
        assertNotNull(response.getBody());
        assertEquals("/api/urls/shorten", response.getBody().getPath());
    }
}
