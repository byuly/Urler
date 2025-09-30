package com.urler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClickEventMessage {
    private Long urlId;
    private int clicks;
    private LocalDateTime clickDate;
}
