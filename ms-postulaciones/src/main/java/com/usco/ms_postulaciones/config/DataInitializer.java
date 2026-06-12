package com.usco.ms_postulaciones.config;

import com.usco.ms_postulaciones.postulacion.EstadoPostulacion;
import com.usco.ms_postulaciones.postulacion.Postulacion;
import com.usco.ms_postulaciones.postulacion.PostulacionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PostulacionRepository postulacionRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        if (postulacionRepository.count() > 0) {
            log.info("Ya existen postulaciones en la base de datos. Se omite la insercion de datos de prueba.");
            return;
        }

        log.info("Insertando datos de prueba de postulaciones...");

        Long anaId = jdbcTemplate.queryForObject(
                "SELECT id FROM usuarios WHERE correo = ?", Long.class, "ana.ramirez@usco.edu.co");
        Long luisId = jdbcTemplate.queryForObject(
                "SELECT id FROM usuarios WHERE correo = ?", Long.class, "luis.gomez@usco.edu.co");
        Long valentinaId = jdbcTemplate.queryForObject(
                "SELECT id FROM usuarios WHERE correo = ?", Long.class, "valentina.castro@usco.edu.co");

        Long convInvId = jdbcTemplate.queryForObject(
                "SELECT id FROM convocatorias WHERE nombre = ?", Long.class, "Convocatoria de Investigacion 2025-I");
        Long convInnId = jdbcTemplate.queryForObject(
                "SELECT id FROM convocatorias WHERE nombre = ?", Long.class, "Convocatoria de Innovacion 2025");
        Long convMovId = jdbcTemplate.queryForObject(
                "SELECT id FROM convocatorias WHERE nombre = ?", Long.class, "Convocatoria de Movilidad Academica 2025");

        List<Postulacion> postulaciones = List.of(
                Postulacion.builder()
                        .usuarioId(anaId)
                        .convocatoriaId(convInvId)
                        .estado(EstadoPostulacion.APROBADA)
                        .fechaPostulacion(LocalDateTime.of(2025, 3, 5, 10, 30))
                        .build(),
                Postulacion.builder()
                        .usuarioId(luisId)
                        .convocatoriaId(convInvId)
                        .estado(EstadoPostulacion.PENDIENTE)
                        .fechaPostulacion(LocalDateTime.of(2025, 3, 10, 14, 15))
                        .build(),
                Postulacion.builder()
                        .usuarioId(valentinaId)
                        .convocatoriaId(convInvId)
                        .estado(EstadoPostulacion.PENDIENTE)
                        .fechaPostulacion(LocalDateTime.of(2025, 3, 12, 9, 0))
                        .build(),
                Postulacion.builder()
                        .usuarioId(anaId)
                        .convocatoriaId(convInnId)
                        .estado(EstadoPostulacion.PENDIENTE)
                        .fechaPostulacion(LocalDateTime.of(2025, 4, 5, 11, 45))
                        .build(),
                Postulacion.builder()
                        .usuarioId(luisId)
                        .convocatoriaId(convInnId)
                        .estado(EstadoPostulacion.RECHAZADA)
                        .fechaPostulacion(LocalDateTime.of(2025, 4, 8, 16, 30))
                        .build(),
                Postulacion.builder()
                        .usuarioId(valentinaId)
                        .convocatoriaId(convMovId)
                        .estado(EstadoPostulacion.PENDIENTE)
                        .fechaPostulacion(LocalDateTime.of(2025, 6, 10, 8, 20))
                        .build(),
                Postulacion.builder()
                        .usuarioId(anaId)
                        .convocatoriaId(convMovId)
                        .estado(EstadoPostulacion.PENDIENTE)
                        .fechaPostulacion(LocalDateTime.of(2025, 6, 12, 10, 0))
                        .build());

        postulacionRepository.saveAll(postulaciones);
        log.info("{} postulaciones de prueba insertadas correctamente.", postulaciones.size());
    }
}
