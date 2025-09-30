package com.urler.controller;

import com.urler.table.Url;
import com.urler.service.UrlService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class RedirectController {

    private UrlService urlService;

    @GetMapping("/{shortenedUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortenedUrl){
        Url url = urlService.getOriginalUrl(shortenedUrl);
        if (url != null) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Location", url.getUrl());
            return ResponseEntity.status(302).headers(httpHeaders).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
