package com.urler.table;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class EngagementMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime recordedAt;
    private String deviceType;
    private String location;
    private String referrer;
    private int timeSpent; // in seconds

    @ManyToOne
    @JoinColumn(name = "url_mapping_id")
    private Url urlMapping;
}
