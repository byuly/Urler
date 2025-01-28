package com.urler.sb.table;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Data
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    private String shortenedUrl;
    private int clicks = 0;
    private LocalDateTime dateCreated; // many-to-one relationship with users table

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "url")
    private List<Clicks> clickEvents;
}
