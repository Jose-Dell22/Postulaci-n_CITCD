package com.usco.ms_usuarios.service;

import com.usco.ms_usuarios.auth.AuthResponse;
import com.usco.ms_usuarios.auth.LoginRequest;
import com.usco.ms_usuarios.auth.RegisterRequest;
import com.usco.ms_usuarios.usuario.*;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;
    private final UsuarioDetailsService usuarioDetailsService;

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

    public AuthResponse login(
            LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getPassword()
                )
        );

        UserDetails user =
                usuarioDetailsService.loadUserByUsername(
                        request.getCorreo()
                );

        String token =
                jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}