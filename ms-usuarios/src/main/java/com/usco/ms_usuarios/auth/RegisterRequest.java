package com.usco.ms_usuarios.auth;

import lombok.Data;

@Data
public class RegisterRequest {

    private String identificacion;
    private String nombre;
    private String correo;
    private String password;
}