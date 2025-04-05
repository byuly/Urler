package com.urler.security.jwt;

import jakarta.servlet.http.HttpServletRequest;

public class JwtUtils {
    // pass in token with authorization header -> Bearer <TOKEN> is the format
    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
