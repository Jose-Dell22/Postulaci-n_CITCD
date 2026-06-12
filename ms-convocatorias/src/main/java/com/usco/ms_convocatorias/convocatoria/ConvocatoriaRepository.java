package com.usco.ms_convocatorias.convocatoria;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConvocatoriaRepository extends JpaRepository<Convocatoria, Long> {
    List<Convocatoria> findByReportadaTrue();
}
