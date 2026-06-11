package com.usco.ms_postulaciones.service;

import com.usco.ms_postulaciones.dto.ReportePostulacionConvocatoriaDto;
import com.usco.ms_postulaciones.dto.ReporteResultadoPostulacionDto;
import com.usco.ms_postulaciones.postulacion.EstadoPostulacion;
import com.usco.ms_postulaciones.postulacion.PostulacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final PostulacionRepository repository;

    public List<ReportePostulacionConvocatoriaDto> postulacionesPorConvocatoria() {
        return repository.contarPorConvocatoria().stream()
                .map(row -> new ReportePostulacionConvocatoriaDto(
                        (Long) row[0],
                        (Long) row[1]))
                .toList();
    }

    public List<ReporteResultadoPostulacionDto> resultadoPostulaciones() {
        return Arrays.stream(EstadoPostulacion.values())
                .map(estado -> new ReporteResultadoPostulacionDto(
                        estado.name(),
                        repository.countByEstado(estado)))
                .toList();
    }
}
