package com.usco.ms_postulaciones.service;

import com.usco.ms_postulaciones.client.ConvocatoriaClient;
import com.usco.ms_postulaciones.dto.ConvocatoriaDto;
import com.usco.ms_postulaciones.dto.PostulacionRequest;
import com.usco.ms_postulaciones.postulacion.EstadoPostulacion;
import com.usco.ms_postulaciones.postulacion.Postulacion;
import com.usco.ms_postulaciones.postulacion.PostulacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostulacionService {

    private final PostulacionRepository repository;
    private final ConvocatoriaClient convocatoriaClient;

    public List<Postulacion> listar() {
        return repository.findAll();
    }

    public Postulacion buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulación no encontrada con ID: " + id));
    }

    public Postulacion crear(PostulacionRequest request) {
        if (repository.existsByUsuarioIdAndConvocatoriaId(
                request.getUsuarioId(),
                request.getConvocatoriaId())) {
            throw new RuntimeException("El usuario ya se postuló a esta convocatoria");
        }

        ConvocatoriaDto convocatoria = convocatoriaClient.obtenerPorId(
                request.getConvocatoriaId(),
                obtenerTokenAutorizacion());

        if ("CERRADA".equals(convocatoria.getEstado())) {
            throw new RuntimeException("No se puede postular a una convocatoria cerrada");
        }

        long ocupados = repository.countByConvocatoriaIdAndEstadoIn(
                request.getConvocatoriaId(),
                List.of(EstadoPostulacion.PENDIENTE, EstadoPostulacion.APROBADA));

        if (ocupados >= convocatoria.getCuposDisponibles()) {
            throw new RuntimeException("No hay cupos disponibles en la convocatoria");
        }

        Postulacion postulacion = Postulacion.builder()
                .usuarioId(request.getUsuarioId())
                .convocatoriaId(request.getConvocatoriaId())
                .estado(EstadoPostulacion.PENDIENTE)
                .fechaPostulacion(LocalDateTime.now())
                .build();

        return repository.save(postulacion);
    }

    public Postulacion actualizarEstado(Long id, EstadoPostulacion estado) {
        if (estado == EstadoPostulacion.PENDIENTE) {
            throw new RuntimeException("El estado debe ser APROBADA o RECHAZADA");
        }

        Postulacion postulacion = buscarPorId(id);

        if (estado == EstadoPostulacion.APROBADA) {
            ConvocatoriaDto convocatoria = convocatoriaClient.obtenerPorId(
                    postulacion.getConvocatoriaId(),
                    obtenerTokenAutorizacion());

            long aprobadas = repository.countByConvocatoriaIdAndEstadoIn(
                    postulacion.getConvocatoriaId(),
                    List.of(EstadoPostulacion.APROBADA));

            if (aprobadas >= convocatoria.getCuposDisponibles()) {
                throw new RuntimeException("No hay cupos disponibles para aprobar más postulaciones");
            }
        }

        postulacion.setEstado(estado);
        return repository.save(postulacion);
    }

    private String obtenerTokenAutorizacion() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            throw new RuntimeException("No se encontró el contexto de la solicitud");
        }

        String authHeader = attributes.getRequest().getHeader("Authorization");
        if (authHeader == null || authHeader.isBlank()) {
            throw new RuntimeException("Token de autorización requerido");
        }

        return authHeader;
    }
}
