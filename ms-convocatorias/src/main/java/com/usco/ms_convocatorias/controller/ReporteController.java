package com.usco.ms_convocatorias.controller;

import com.usco.ms_convocatorias.dto.ReporteConvocatoriaCategoriaDto;
import com.usco.ms_convocatorias.service.ReporteService;
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

    @GetMapping("/convocatorias-categoria")
    public List<ReporteConvocatoriaCategoriaDto> convocatoriasPorCategoria() {
        return service.convocatoriasPorCategoria();
    }
}
