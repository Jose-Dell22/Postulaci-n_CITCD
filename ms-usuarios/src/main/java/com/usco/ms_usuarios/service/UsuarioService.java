package com.usco.ms_usuarios.service;

import com.usco.ms_usuarios.usuario.Usuario;
import com.usco.ms_usuarios.usuario.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    // Listar todos los usuarios
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // Buscar usuario por ID
    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    // Actualizar usuario
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {

        Usuario usuario = buscarPorId(id);

        usuario.setIdentificacion(usuarioActualizado.getIdentificacion());
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setCorreo(usuarioActualizado.getCorreo());
        usuario.setRol(usuarioActualizado.getRol());
        usuario.setEstado(usuarioActualizado.getEstado());

        // Actualizar contraseña solo si se envía una nueva
        if (usuarioActualizado.getPassword() != null
                && !usuarioActualizado.getPassword().isBlank()) {

            usuario.setPassword(
                    encoder.encode(usuarioActualizado.getPassword())
            );
        }

        return repository.save(usuario);
    }

    // Eliminar usuario
    public void eliminar(Long id) {
        Usuario usuario = buscarPorId(id);
        repository.delete(usuario);
    }
}