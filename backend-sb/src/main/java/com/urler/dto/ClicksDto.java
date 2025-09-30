package com.urler.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ClicksDto {
    private LocalDate clickDate;
    private Long count;
}
