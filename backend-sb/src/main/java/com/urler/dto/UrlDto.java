package com.urler.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlDto {
    private Long id;
    private String url;
    private String shortenedUrl;
    private String customAlias;
    private int clicks;
    private LocalDateTime dateCreated;
    private String username;
}
