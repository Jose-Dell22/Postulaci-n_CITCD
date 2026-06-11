package com.usco.ms_usuarios.auth;

import com.usco.ms_usuarios.security.JwtService;
import com.usco.ms_usuarios.usuario.*;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthResponse register(
            RegisterRequest request) {

        Usuario usuario = Usuario.builder()
                .identificacion(request.getIdentificacion())
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(
                        encoder.encode(
                                request.getPassword()
                        )
                )
                .rol(Rol.ESTUDIANTE)
                .estado(true)
                .build();

        repository.save(usuario);

        String token =
                jwtService.generateToken(usuario);

        return new AuthResponse(token);
    }
}