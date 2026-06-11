package com.usco.ms_postulaciones.dto;

import com.usco.ms_postulaciones.postulacion.EstadoPostulacion;
import lombok.Data;

@Data
public class EstadoPostulacionRequest {

    private EstadoPostulacion estado;
}
