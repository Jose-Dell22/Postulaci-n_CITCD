package com.usco.ms_usuarios.auth;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request) {

        return service.register(request);
    }
}