package com.usco.ms_convocatorias.categoria;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.usco.ms_convocatorias.convocatoria.Convocatoria;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String nombre;

    private String descripcion;

    @ManyToMany(mappedBy = "categorias")
    @JsonIgnore
    @Builder.Default
    private Set<Convocatoria> convocatorias = new HashSet<>();
}
