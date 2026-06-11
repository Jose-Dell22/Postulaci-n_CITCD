package com.usco.ms_postulaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporteResultadoPostulacionDto {

    private String estado;
    private Long total;
}
