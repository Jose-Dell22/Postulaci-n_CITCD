package com.usco.ms_postulaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportePostulacionConvocatoriaDto {

    private Long convocatoriaId;
    private Long totalPostulaciones;
}
