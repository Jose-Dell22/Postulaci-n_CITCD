package com.usco.ms_usuarios.dto;

public record LoginRequest(
        String username,
        String password
) {}