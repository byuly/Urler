package com.urler.controller;

import com.urler.dto.ClicksDto;
import com.urler.dto.UrlDto;
import com.urler.table.User;
import com.urler.service.UrlService;
import com.urler.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlController {
    private UrlService urlService;
    private UserService userService;

    // {"url":"https://example.com"}
//    https://abc.com/QN7XOa0a --> https://example.com

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlDto> createShortUrl(@RequestBody UrlDto requestDto,
                                                        Principal principal){
        User user = userService.findByUsername(principal.getName());
        UrlDto urlDto = urlService.createShortUrl(requestDto, user);
        return ResponseEntity.ok(urlDto);
    }


    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlDto>> getUserUrls(Principal principal){
        User user = userService.findByUsername(principal.getName());
        List<UrlDto> urls = urlService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }


    @GetMapping("/analytics/{shortenedUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClicksDto>> getUrlAnalytics(@PathVariable String shortenedUrl,
                                                               @RequestParam("startDate") String startDate,
                                                               @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        List<ClicksDto> clicksDtos = urlService.getClickEventsByDate(shortenedUrl, start, end);
        return ResponseEntity.ok(clicksDtos);
    }


    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(Principal principal,
                                                                     @RequestParam("startDate") String startDate,
                                                                     @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        Map<LocalDate, Long> totalClicks = urlService.getTotalClicksByUserAndDate(user, start, end);
        return ResponseEntity.ok(totalClicks);
    }
}
