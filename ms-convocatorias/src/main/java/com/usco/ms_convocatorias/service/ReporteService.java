package com.usco.ms_convocatorias.service;

import com.usco.ms_convocatorias.categoria.Categoria;
import com.usco.ms_convocatorias.categoria.CategoriaRepository;
import com.usco.ms_convocatorias.dto.ReporteConvocatoriaCategoriaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<ReporteConvocatoriaCategoriaDto> convocatoriasPorCategoria() {
        return categoriaRepository.findAll().stream()
                .map(this::mapearReporte)
                .toList();
    }

    private ReporteConvocatoriaCategoriaDto mapearReporte(Categoria categoria) {
        long total = categoria.getConvocatorias() != null
                ? categoria.getConvocatorias().size()
                : 0;
        return new ReporteConvocatoriaCategoriaDto(categoria.getNombre(), total);
    }
}
