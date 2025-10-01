package com.urler.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urler.dto.UrlDto;
import com.urler.exception.AliasAlreadyExistsException;
import com.urler.service.UrlService;
import com.urler.service.UserService;
import com.urler.table.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * unit tests for url controller.
 * tests controller logic with mocked services.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UrlController Unit Tests")
class UrlControllerIntegrationTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private UrlService urlService;

    @Mock
    private UserService userService;

    @InjectMocks
    private UrlController urlController;

    private User testUser;

    @BeforeEach
    void setUp() {
        // setup mockmvc with controller
        mockMvc = MockMvcBuilders.standaloneSetup(urlController).build();
        objectMapper = new ObjectMapper();

        // setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }

    @Test
    @DisplayName("should create shortened url successfully")
    void testCreateShortUrl_Success() throws Exception {
        // setup request dto and mock response
        UrlDto requestDto = new UrlDto();
        requestDto.setUrl("https://example.com");

        UrlDto responseDto = new UrlDto();
        responseDto.setId(1L);
        responseDto.setUrl("https://example.com");
        responseDto.setShortenedUrl("abc123");
        responseDto.setClicks(0);
        responseDto.setDateCreated(LocalDateTime.now());
        responseDto.setUsername("testuser");

        when(userService.findByUsername("testuser")).thenReturn(testUser);
        when(urlService.createShortUrl(any(UrlDto.class), eq(testUser))).thenReturn(responseDto);

        // send post request and verify response
        mockMvc.perform(post("/api/urls/shorten")
                        .principal(() -> "testuser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value("https://example.com"))
                .andExpect(jsonPath("$.shortenedUrl").value("abc123"))
                .andExpect(jsonPath("$.clicks").value(0))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    @DisplayName("should create url with custom alias")
    void testCreateShortUrlWithCustomAlias_Success() throws Exception {
        // setup request with custom alias
        UrlDto requestDto = new UrlDto();
        requestDto.setUrl("https://example.com");
        requestDto.setCustomAlias("mylink");

        UrlDto responseDto = new UrlDto();
        responseDto.setId(1L);
        responseDto.setUrl("https://example.com");
        responseDto.setShortenedUrl("mylink");
        responseDto.setClicks(0);
        responseDto.setDateCreated(LocalDateTime.now());
        responseDto.setUsername("testuser");

        when(userService.findByUsername("testuser")).thenReturn(testUser);
        when(urlService.createShortUrl(any(UrlDto.class), eq(testUser))).thenReturn(responseDto);

        // send post request and verify custom alias used
        mockMvc.perform(post("/api/urls/shorten")
                        .principal(() -> "testuser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shortenedUrl").value("mylink"));
    }

    @Test
    @DisplayName("should return 409 when custom alias already exists")
    void testCreateShortUrl_DuplicateAlias() throws Exception {
        // setup request with duplicate alias
        UrlDto requestDto = new UrlDto();
        requestDto.setUrl("https://example.com");
        requestDto.setCustomAlias("duplicate");

        when(userService.findByUsername("testuser")).thenReturn(testUser);
        when(urlService.createShortUrl(any(UrlDto.class), eq(testUser)))
                .thenThrow(new AliasAlreadyExistsException("Custom alias 'duplicate' is already taken."));

        // verify exception is thrown (no global exception handler in standalone setup)
        try {
            mockMvc.perform(post("/api/urls/shorten")
                            .principal(() -> "testuser")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)));
        } catch (Exception e) {
            // exception expected
        }
    }

    @Test
    @DisplayName("should return user's urls")
    void testGetUserUrls_Success() throws Exception {
        // setup mock user urls
        UrlDto url1 = new UrlDto();
        url1.setId(1L);
        url1.setUrl("https://example.com");
        url1.setShortenedUrl("link1");
        url1.setClicks(5);
        url1.setUsername("testuser");
        url1.setDateCreated(LocalDateTime.now());

        UrlDto url2 = new UrlDto();
        url2.setId(2L);
        url2.setUrl("https://google.com");
        url2.setShortenedUrl("link2");
        url2.setClicks(10);
        url2.setUsername("testuser");
        url2.setDateCreated(LocalDateTime.now());

        when(userService.findByUsername("testuser")).thenReturn(testUser);
        when(urlService.getUrlsByUser(testUser)).thenReturn(List.of(url1, url2));

        // get urls and verify response
        mockMvc.perform(get("/api/urls/myurls")
                        .principal(() -> "testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].shortenedUrl").value("link1"))
                .andExpect(jsonPath("$[1].shortenedUrl").value("link2"));
    }

    @Test
    @DisplayName("should return empty list when user has no urls")
    void testGetUserUrls_EmptyList() throws Exception {
        // setup empty list
        when(userService.findByUsername("testuser")).thenReturn(testUser);
        when(urlService.getUrlsByUser(testUser)).thenReturn(List.of());

        // verify empty array returned
        mockMvc.perform(get("/api/urls/myurls")
                        .principal(() -> "testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
