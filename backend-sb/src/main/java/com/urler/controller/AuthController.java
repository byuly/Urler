package com.urler.controller;

import com.urler.dto.LoginRequest;
import com.urler.dto.RegisterRequest;
import com.urler.service.UserService;
import com.urler.table.User;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        try {
            return ResponseEntity.ok(userService.authenticateUser(loginRequest));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setRole("ROLE_USER");
        userService.registerUser(user);
        return ResponseEntity.ok(java.util.Map.of("message", "User registered successfully"));
    }
}
