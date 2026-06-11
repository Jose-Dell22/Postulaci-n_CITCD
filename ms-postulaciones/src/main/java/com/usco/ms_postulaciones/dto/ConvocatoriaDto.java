package com.usco.ms_postulaciones.dto;

import lombok.Data;

@Data
public class ConvocatoriaDto {

    private Long id;
    private String nombre;
    private String estado;
    private Integer cuposDisponibles;
}
