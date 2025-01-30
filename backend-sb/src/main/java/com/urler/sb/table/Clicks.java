package com.urler.sb.table;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Clicks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickDate;

    @ManyToOne
    @JoinColumn(name = "url_id")
    private Url url;
    
}
