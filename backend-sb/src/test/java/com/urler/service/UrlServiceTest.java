package com.urler.service;

import com.urler.dto.UrlDto;
import com.urler.exception.AliasAlreadyExistsException;
import com.urler.exception.ResourceNotFoundException;
import com.urler.repository.ClicksRepository;
import com.urler.repository.UrlRepository;
import com.urler.table.Url;
import com.urler.table.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UrlService.
 * Tests URL shortening logic, validation, and analytics functionality.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UrlService Tests")
class UrlServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private ClicksRepository clicksRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private UrlService urlService;

    private User testUser;
    private UrlDto testUrlDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testUrlDto = new UrlDto();
        testUrlDto.setUrl("https://example.com");
    }

    @Test
    @DisplayName("Should create short URL with custom alias successfully")
    void testCreateShortUrlWithCustomAlias() {
        // setup custom alias request
        String customAlias = "mylink";
        testUrlDto.setCustomAlias(customAlias);

        // mock repository to return null (alias is available)
        when(urlRepository.findByShortenedUrl(customAlias)).thenReturn(null);
        when(urlRepository.save(any(Url.class))).thenAnswer(invocation -> {
            Url url = invocation.getArgument(0);
            url.setId(1L);
            return url;
        });

        // create short url
        UrlDto result = urlService.createShortUrl(testUrlDto, testUser);

        // verify result has custom alias
        assertNotNull(result);
        assertEquals(customAlias, result.getShortenedUrl());
        assertEquals(testUrlDto.getUrl(), result.getUrl());
        assertEquals(testUser.getUsername(), result.getUsername());

        verify(urlRepository).findByShortenedUrl(customAlias);
        verify(urlRepository).save(any(Url.class));
    }

    @Test
    @DisplayName("Should throw AliasAlreadyExistsException when custom alias is already taken")
    void testCreateShortUrlWithDuplicateAlias() {
        // setup duplicate alias that already exists
        String duplicateAlias = "taken";
        testUrlDto.setCustomAlias(duplicateAlias);

        Url existingUrl = new Url();
        existingUrl.setShortenedUrl(duplicateAlias);
        when(urlRepository.findByShortenedUrl(duplicateAlias)).thenReturn(existingUrl);

        // verify exception is thrown
        AliasAlreadyExistsException exception = assertThrows(
                AliasAlreadyExistsException.class,
                () -> urlService.createShortUrl(testUrlDto, testUser)
        );

        assertTrue(exception.getMessage().contains(duplicateAlias));
        assertTrue(exception.getMessage().contains("already taken"));

        verify(urlRepository).findByShortenedUrl(duplicateAlias);
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    @DisplayName("Should create short URL with random alias when no custom alias provided")
    void testCreateShortUrlWithRandomAlias() {
        // no custom alias provided
        testUrlDto.setCustomAlias(null);

        when(urlRepository.save(any(Url.class))).thenAnswer(invocation -> {
            Url url = invocation.getArgument(0);
            url.setId(1L);
            return url;
        });

        // create url with random alias
        UrlDto result = urlService.createShortUrl(testUrlDto, testUser);

        // verify random alias was generated
        assertNotNull(result);
        assertNotNull(result.getShortenedUrl());
        assertEquals(8, result.getShortenedUrl().length());
        assertEquals(testUrlDto.getUrl(), result.getUrl());

        verify(urlRepository, never()).findByShortenedUrl(anyString());
        verify(urlRepository).save(any(Url.class));
    }

    @Test
    @DisplayName("Should create short URL when custom alias is empty string")
    void testCreateShortUrlWithEmptyAlias() {
        // custom alias is just whitespace
        testUrlDto.setCustomAlias("   ");

        when(urlRepository.save(any(Url.class))).thenAnswer(invocation -> {
            Url url = invocation.getArgument(0);
            url.setId(1L);
            return url;
        });

        // create url
        UrlDto result = urlService.createShortUrl(testUrlDto, testUser);

        // verify random alias was used instead
        assertNotNull(result);
        assertNotNull(result.getShortenedUrl());
        assertEquals(8, result.getShortenedUrl().length());

        verify(urlRepository).save(any(Url.class));
    }

    @Test
    @DisplayName("Should return list of URLs for a specific user")
    void testGetUrlsByUser() {
        // create test urls for user
        Url url1 = new Url();
        url1.setId(1L);
        url1.setUrl("https://example.com");
        url1.setShortenedUrl("abc123");
        url1.setUser(testUser);
        url1.setClicks(10);
        url1.setDateCreated(LocalDateTime.now());

        Url url2 = new Url();
        url2.setId(2L);
        url2.setUrl("https://google.com");
        url2.setShortenedUrl("xyz789");
        url2.setUser(testUser);
        url2.setClicks(5);
        url2.setDateCreated(LocalDateTime.now());

        when(urlRepository.findByUser(testUser)).thenReturn(List.of(url1, url2));

        // get user's urls
        List<UrlDto> results = urlService.getUrlsByUser(testUser);

        // verify correct urls returned
        assertNotNull(results);
        assertEquals(2, results.size());

        UrlDto firstDto = results.get(0);
        assertEquals("abc123", firstDto.getShortenedUrl());
        assertEquals("https://example.com", firstDto.getUrl());
        assertEquals(10, firstDto.getClicks());

        verify(urlRepository).findByUser(testUser);
    }

    @Test
    @DisplayName("Should increment clicks and save click event when getting original URL")
    void testGetOriginalUrlIncrementsClicks() {
        // setup url with 5 clicks
        Url url = new Url();
        url.setId(1L);
        url.setUrl("https://example.com");
        url.setShortenedUrl("abc123");
        url.setClicks(5);

        when(urlRepository.findByShortenedUrl("abc123")).thenReturn(url);
        when(urlRepository.save(any(Url.class))).thenReturn(url);

        // get original url
        Url result = urlService.getOriginalUrl("abc123");

        // verify clicks incremented and event saved
        assertNotNull(result);
        assertEquals(6, result.getClicks());
        assertEquals("https://example.com", result.getUrl());

        verify(urlRepository).findByShortenedUrl("abc123");
        verify(urlRepository).save(url);
        verify(clicksRepository).save(any());
        verify(messagingTemplate).convertAndSend(eq("/topic/clicks/1"), any(Object.class));
    }

    @Test
    @DisplayName("Should return null when getting non-existent original URL")
    void testGetOriginalUrlNotFound() {
        // mock url not found
        when(urlRepository.findByShortenedUrl("nonexistent")).thenReturn(null);

        // try to get url
        Url result = urlService.getOriginalUrl("nonexistent");

        // verify null returned and nothing saved
        assertNull(result);

        verify(urlRepository).findByShortenedUrl("nonexistent");
        verify(urlRepository, never()).save(any());
        verify(clicksRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when getting analytics for non-existent URL")
    void testGetClickEventsByDateThrowsExceptionForNonExistentUrl() {
        // setup date range for analytics
        String shortenedUrl = "nonexistent";
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        when(urlRepository.findByShortenedUrl(shortenedUrl)).thenReturn(null);

        // verify exception is thrown
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> urlService.getClickEventsByDate(shortenedUrl, start, end)
        );

        assertTrue(exception.getMessage().contains(shortenedUrl));
        assertTrue(exception.getMessage().contains("not found"));

        verify(urlRepository).findByShortenedUrl(shortenedUrl);
        verify(clicksRepository, never()).findByUrlAndClickDateBetween(any(), any(), any());
    }

    @Test
    @DisplayName("Should generate random alias with correct length and characters")
    void testRandomAliasGeneration() {
        // no custom alias
        testUrlDto.setCustomAlias(null);

        when(urlRepository.save(any(Url.class))).thenAnswer(invocation -> {
            Url url = invocation.getArgument(0);
            url.setId(1L);
            return url;
        });

        // create url
        UrlDto result = urlService.createShortUrl(testUrlDto, testUser);

        // verify random alias is 8 alphanumeric characters
        String alias = result.getShortenedUrl();
        assertEquals(8, alias.length());
        assertTrue(alias.matches("[A-Za-z0-9]{8}"), "Alias should only contain alphanumeric characters");
    }
}
