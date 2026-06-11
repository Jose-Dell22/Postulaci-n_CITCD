package com.usco.ms_postulaciones.controller;

import com.usco.ms_postulaciones.dto.ReportePostulacionConvocatoriaDto;
import com.usco.ms_postulaciones.dto.ReporteResultadoPostulacionDto;
import com.usco.ms_postulaciones.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService service;

    @GetMapping("/postulaciones-convocatoria")
    public List<ReportePostulacionConvocatoriaDto> postulacionesPorConvocatoria() {
        return service.postulacionesPorConvocatoria();
    }

    @GetMapping("/resultado-postulaciones")
    public List<ReporteResultadoPostulacionDto> resultadoPostulaciones() {
        return service.resultadoPostulaciones();
    }
}
