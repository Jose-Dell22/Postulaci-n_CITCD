package com.usco.ms_postulaciones.postulacion;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "postulaciones",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "convocatoria_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "convocatoria_id", nullable = false)
    private Long convocatoriaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoPostulacion estado;

    @Column(name = "fecha_postulacion")
    private LocalDateTime fechaPostulacion;
}
