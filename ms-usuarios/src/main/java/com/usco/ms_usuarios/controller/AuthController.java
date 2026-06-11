package com.usco.ms_usuarios.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import com.usco.ms_usuarios.auth.AuthResponse;
import com.usco.ms_usuarios.auth.LoginRequest;
import com.usco.ms_usuarios.auth.RegisterRequest;
import com.usco.ms_usuarios.service.AuthService;

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
    @PostMapping("/login")
public AuthResponse login(
        @RequestBody LoginRequest request) {

    return service.login(request);
}
}