package com.usco.ms_convocatorias.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporteConvocatoriaCategoriaDto {

    private String categoria;
    private Long totalConvocatorias;
}
