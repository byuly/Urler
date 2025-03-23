package com.urler.table;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID will be generated in incremental order
    private Long id;
    private String email;
    private String username;
    private String password;
    private String role = "ROLE_USER";
}
