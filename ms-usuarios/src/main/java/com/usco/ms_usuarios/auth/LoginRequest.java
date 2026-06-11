package com.usco.ms_usuarios.auth;

import lombok.Data;

@Data
public class LoginRequest {

    private String correo;
    private String password;
}