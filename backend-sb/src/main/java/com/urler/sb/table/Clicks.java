package com.urler.sb.table;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Clicks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickDate;
    
}
