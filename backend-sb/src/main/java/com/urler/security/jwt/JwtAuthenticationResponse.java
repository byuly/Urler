package com.urler.security.jwt;


import lombok.AllArgsConstructor;
import lombok.Data;

// data class that represents authentication response
@Data
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String token;
}
