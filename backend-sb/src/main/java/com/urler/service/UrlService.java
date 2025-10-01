package com.urler.service;

import com.urler.dto.ClickEventMessage;
import com.urler.dto.ClicksDto;
import com.urler.dto.UrlDto;
import com.urler.exception.AliasAlreadyExistsException;
import com.urler.table.Clicks;
import com.urler.table.Url;
import com.urler.table.User;
import com.urler.repository.ClicksRepository;
import com.urler.repository.UrlRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UrlService {

    private UrlRepository urlRepository;
    private ClicksRepository clicksRepository;
    private SimpMessagingTemplate messagingTemplate;

    public UrlDto createShortUrl(UrlDto urlDto, User user) {
        String shortUrl;
        if (urlDto.getCustomAlias() != null && !urlDto.getCustomAlias().trim().isEmpty()) {
            if (urlRepository.findByShortenedUrl(urlDto.getCustomAlias()) != null) {
                throw new AliasAlreadyExistsException("Custom alias '" + urlDto.getCustomAlias() + "' is already taken.");
            }
            shortUrl = urlDto.getCustomAlias();
        } else {
            shortUrl = generateShortUrl();
        }

        Url url = new Url();
        url.setUrl(urlDto.getUrl());
        url.setShortenedUrl(shortUrl);
        url.setUser(user);
        url.setDateCreated(LocalDateTime.now());
        Url savedUrl = urlRepository.save(url);
        return convertToDto(savedUrl);
    }

    private UrlDto convertToDto(Url url){
        UrlDto urlDto = new UrlDto();
        urlDto.setId(url.getId());
        urlDto.setUrl(url.getUrl());
        urlDto.setShortenedUrl(url.getShortenedUrl());
        urlDto.setClicks(url.getClicks());
        urlDto.setDateCreated(url.getDateCreated());
        urlDto.setUsername(url.getUser().getUsername());
        return urlDto;
    }

    private String generateShortUrl() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        Random random = new Random();
        StringBuilder shortUrl = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            shortUrl.append(characters.charAt(random.nextInt(characters.length())));
        }
        return shortUrl.toString();
    }

    public List<UrlDto> getUrlsByUser(User user) {
        return urlRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ClicksDto> getClickEventsByDate(String shortenedUrl, LocalDateTime start, LocalDateTime end) {
        Url url = urlRepository.findByShortenedUrl(shortenedUrl);
        if (url == null) {
            throw new com.urler.exception.ResourceNotFoundException("URL '" + shortenedUrl + "' not found.");
        }
        return clicksRepository.findByUrlAndClickDateBetween(url, start, end).stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    ClicksDto clicksDto = new ClicksDto();
                    clicksDto.setClickDate(entry.getKey());
                    clicksDto.setCount(entry.getValue());
                    return clicksDto;
                })
                .collect(Collectors.toList());
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<Url> urls = urlRepository.findByUser(user);
        List<Clicks> clicks = clicksRepository.findByUrlInAndClickDateBetween(urls, start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        return clicks.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));

    }

    public Url getOriginalUrl(String shortenedUrl) {
        Url url = urlRepository.findByShortenedUrl(shortenedUrl);
        if (url != null) {
            url.setClicks(url.getClicks() + 1);
            urlRepository.save(url);

            // Record Click Event
            LocalDateTime now = LocalDateTime.now();
            Clicks clicks = new Clicks();
            clicks.setClickDate(now);
            clicks.setUrl(url);
            clicksRepository.save(clicks);

            // Publish WebSocket message
            ClickEventMessage message = new ClickEventMessage(url.getId(), url.getClicks(), now);
            messagingTemplate.convertAndSend("/topic/clicks/" + url.getId(), message);
        }

        return url;
    }
}
