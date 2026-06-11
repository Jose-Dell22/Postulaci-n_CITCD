package com.usco.ms_convocatorias.dto;

import com.usco.ms_convocatorias.convocatoria.EstadoConvocatoria;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class ConvocatoriaRequest {

    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer cuposDisponibles;
    private EstadoConvocatoria estado;
    private Set<Long> categoriaIds;
}
