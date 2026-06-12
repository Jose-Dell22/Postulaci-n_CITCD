package com.usco.ms_usuarios.config;

import com.usco.ms_usuarios.usuario.Rol;
import com.usco.ms_usuarios.usuario.Usuario;
import com.usco.ms_usuarios.usuario.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            log.info("Ya existen usuarios en la base de datos. Se omite la insercion de datos de prueba.");
            return;
        }

        log.info("Insertando datos de prueba de usuarios...");

        String password = passwordEncoder.encode("123456");

        List<Usuario> usuarios = List.of(
                Usuario.builder()
                        .identificacion("10000001")
                        .nombre("Carlos Andres Martinez")
                        .correo("carlos.martinez@usco.edu.co")
                        .password(password)
                        .rol(Rol.ADMINISTRADOR)
                        .estado(true)
                        .fechaCreacion(LocalDateTime.of(2025, 1, 15, 8, 0))
                        .build(),
                Usuario.builder()
                        .identificacion("10000002")
                        .nombre("Maria Fernanda Lopez")
                        .correo("maria.lopez@usco.edu.co")
                        .password(password)
                        .rol(Rol.DOCENTE)
                        .estado(true)
                        .fechaCreacion(LocalDateTime.of(2025, 1, 20, 9, 30))
                        .codigoDocente("DOC001")
                        .build(),
                Usuario.builder()
                        .identificacion("10000003")
                        .nombre("Juan Carlos Perez")
                        .correo("juan.perez@usco.edu.co")
                        .password(password)
                        .rol(Rol.DOCENTE)
                        .estado(true)
                        .fechaCreacion(LocalDateTime.of(2025, 2, 1, 10, 0))
                        .codigoDocente("DOC002")
                        .build(),
                Usuario.builder()
                        .identificacion("10000004")
                        .nombre("Ana Sofia Ramirez")
                        .correo("ana.ramirez@usco.edu.co")
                        .password(password)
                        .rol(Rol.ESTUDIANTE)
                        .estado(true)
                        .fechaCreacion(LocalDateTime.of(2025, 2, 10, 7, 45))
                        .build(),
                Usuario.builder()
                        .identificacion("10000005")
                        .nombre("Luis Eduardo Gomez")
                        .correo("luis.gomez@usco.edu.co")
                        .password(password)
                        .rol(Rol.ESTUDIANTE)
                        .estado(true)
                        .fechaCreacion(LocalDateTime.of(2025, 2, 15, 8, 15))
                        .build(),
                Usuario.builder()
                        .identificacion("10000006")
                        .nombre("Valentina Castro")
                        .correo("valentina.castro@usco.edu.co")
                        .password(password)
                        .rol(Rol.ESTUDIANTE)
                        .estado(true)
                        .fechaCreacion(LocalDateTime.of(2025, 3, 1, 11, 0))
                        .build());

        usuarioRepository.saveAll(usuarios);
        log.info("{} usuarios de prueba insertados correctamente.", usuarios.size());
    }
}
