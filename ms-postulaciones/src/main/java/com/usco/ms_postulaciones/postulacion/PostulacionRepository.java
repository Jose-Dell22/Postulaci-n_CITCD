package com.usco.ms_postulaciones.postulacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

    boolean existsByUsuarioIdAndConvocatoriaId(Long usuarioId, Long convocatoriaId);

    long countByConvocatoriaIdAndEstadoIn(Long convocatoriaId, List<EstadoPostulacion> estados);

    List<Postulacion> findByConvocatoriaId(Long convocatoriaId);

    long countByEstado(EstadoPostulacion estado);

    @Query("SELECT p.convocatoriaId, COUNT(p) FROM Postulacion p GROUP BY p.convocatoriaId")
    List<Object[]> contarPorConvocatoria();
}
