package com.usco.ms_convocatorias.config;

import com.usco.ms_convocatorias.categoria.Categoria;
import com.usco.ms_convocatorias.categoria.CategoriaRepository;
import com.usco.ms_convocatorias.convocatoria.Convocatoria;
import com.usco.ms_convocatorias.convocatoria.ConvocatoriaRepository;
import com.usco.ms_convocatorias.convocatoria.EstadoConvocatoria;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ConvocatoriaRepository convocatoriaRepository;

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0 || convocatoriaRepository.count() > 0) {
            log.info("Ya existen categorias o convocatorias. Se omite la insercion de datos de prueba.");
            return;
        }

        log.info("Insertando datos de prueba de categorias y convocatorias...");

        Categoria investigacion = categoriaRepository.save(
                Categoria.builder()
                        .nombre("Investigacion")
                        .descripcion("Proyectos de investigacion cientifica y tecnologica")
                        .build());

        Categoria innovacion = categoriaRepository.save(
                Categoria.builder()
                        .nombre("Innovacion")
                        .descripcion("Proyectos de innovacion y transferencia tecnologica")
                        .build());

        Categoria desarrollo = categoriaRepository.save(
                Categoria.builder()
                        .nombre("Desarrollo Tecnologico")
                        .descripcion("Proyectos de desarrollo de software, hardware y prototipos")
                        .build());

        Categoria emprendimiento = categoriaRepository.save(
                Categoria.builder()
                        .nombre("Emprendimiento")
                        .descripcion("Proyectos de emprendimiento y creacion de empresas")
                        .build());

        Categoria extension = categoriaRepository.save(
                Categoria.builder()
                        .nombre("Extension")
                        .descripcion("Proyectos de extension universitaria y proyeccion social")
                        .build());

        Categoria movilidad = categoriaRepository.save(
                Categoria.builder()
                        .nombre("Movilidad Academica")
                        .descripcion("Proyectos de movilidad nacional e internacional")
                        .build());

        List<Convocatoria> convocatorias = List.of(
                Convocatoria.builder()
                        .nombre("Convocatoria de Investigacion 2025-I")
                        .descripcion("Convocatoria para financiar proyectos de investigacion en todas las areas del conocimiento. Dirigida a docentes y estudiantes de pregrado y posgrado.")
                        .fechaInicio(LocalDate.of(2025, 3, 1))
                        .fechaFin(LocalDate.of(2025, 5, 30))
                        .cuposDisponibles(20)
                        .estado(EstadoConvocatoria.PUBLICADA)
                        .fechaCreacion(LocalDateTime.of(2025, 2, 20, 8, 0))
                        .categorias(Set.of(investigacion, desarrollo))
                        .build(),
                Convocatoria.builder()
                        .nombre("Convocatoria de Innovacion 2025")
                        .descripcion("Convocatoria para proyectos de innovacion tecnologica con impacto en el sector productivo de la region.")
                        .fechaInicio(LocalDate.of(2025, 4, 1))
                        .fechaFin(LocalDate.of(2025, 7, 15))
                        .cuposDisponibles(15)
                        .estado(EstadoConvocatoria.PUBLICADA)
                        .fechaCreacion(LocalDateTime.of(2025, 3, 15, 9, 0))
                        .categorias(Set.of(innovacion, desarrollo))
                        .build(),
                Convocatoria.builder()
                        .nombre("Convocatoria de Emprendimiento 2025-I")
                        .descripcion("Apoyo a iniciativas de emprendimiento universitario con potencial de negocio.")
                        .fechaInicio(LocalDate.of(2025, 5, 1))
                        .fechaFin(LocalDate.of(2025, 8, 30))
                        .cuposDisponibles(10)
                        .estado(EstadoConvocatoria.BORRADOR)
                        .fechaCreacion(LocalDateTime.of(2025, 4, 10, 10, 30))
                        .categorias(Set.of(emprendimiento))
                        .build(),
                Convocatoria.builder()
                        .nombre("Convocatoria de Extension 2024")
                        .descripcion("Convocatoria para proyectos de extension solidaria y proyeccion social ejecutados durante 2024.")
                        .fechaInicio(LocalDate.of(2024, 2, 1))
                        .fechaFin(LocalDate.of(2024, 6, 30))
                        .cuposDisponibles(25)
                        .estado(EstadoConvocatoria.CERRADA)
                        .fechaCreacion(LocalDateTime.of(2024, 1, 15, 7, 0))
                        .categorias(Set.of(extension))
                        .build(),
                Convocatoria.builder()
                        .nombre("Convocatoria de Movilidad Academica 2025")
                        .descripcion("Convocatoria para apoyar la movilidad de estudiantes a universidades nacionales e internacionales.")
                        .fechaInicio(LocalDate.of(2025, 6, 1))
                        .fechaFin(LocalDate.of(2025, 9, 30))
                        .cuposDisponibles(30)
                        .estado(EstadoConvocatoria.PUBLICADA)
                        .fechaCreacion(LocalDateTime.of(2025, 5, 15, 8, 0))
                        .categorias(Set.of(movilidad))
                        .build(),
                Convocatoria.builder()
                        .nombre("Convocatoria Desarrollo Tecnologico 2025")
                        .descripcion("Financiamiento para el desarrollo de prototipos tecnologicos y soluciones de ingenieria.")
                        .fechaInicio(LocalDate.of(2025, 7, 1))
                        .fechaFin(LocalDate.of(2025, 10, 31))
                        .cuposDisponibles(12)
                        .estado(EstadoConvocatoria.BORRADOR)
                        .fechaCreacion(LocalDateTime.of(2025, 6, 1, 11, 0))
                        .categorias(Set.of(desarrollo, innovacion))
                        .build());

        convocatoriaRepository.saveAll(convocatorias);
        log.info("Datos de prueba de categorias y convocatorias insertados correctamente.");
    }
}
