package com.urler.table;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AiInsight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String summary; // short description of insight
    private String prediction; // e.g., "high engagement expected on weekends"
    private LocalDateTime generatedAt;


    @ManyToOne
    @JoinColumn(name = "url_id")
    private Url url;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;
}

