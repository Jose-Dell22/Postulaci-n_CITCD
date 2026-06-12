package com.usco.ms_convocatorias.service;

import com.usco.ms_convocatorias.categoria.Categoria;
import com.usco.ms_convocatorias.categoria.CategoriaRepository;
import com.usco.ms_convocatorias.convocatoria.Convocatoria;
import com.usco.ms_convocatorias.convocatoria.ConvocatoriaRepository;
import com.usco.ms_convocatorias.convocatoria.EstadoConvocatoria;
import com.usco.ms_convocatorias.dto.ConvocatoriaRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ConvocatoriaService {

    private final ConvocatoriaRepository convocatoriaRepository;
    private final CategoriaRepository categoriaRepository;

    public List<Convocatoria> listar() {
        return convocatoriaRepository.findAll();
    }

    public Convocatoria buscarPorId(Long id) {
        return convocatoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Convocatoria no encontrada con ID: " + id));
    }

    public Convocatoria crear(ConvocatoriaRequest request) {
        Convocatoria convocatoria = Convocatoria.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .cuposDisponibles(request.getCuposDisponibles())
                .estado(request.getEstado() != null ? request.getEstado() : EstadoConvocatoria.BORRADOR)
                .fechaCreacion(LocalDateTime.now())
                .categorias(resolverCategorias(request.getCategoriaIds()))
                .build();

        return convocatoriaRepository.save(convocatoria);
    }

    public Convocatoria actualizar(Long id, ConvocatoriaRequest request) {
        Convocatoria convocatoria = buscarPorId(id);

        convocatoria.setNombre(request.getNombre());
        convocatoria.setDescripcion(request.getDescripcion());
        convocatoria.setFechaInicio(request.getFechaInicio());
        convocatoria.setFechaFin(request.getFechaFin());
        convocatoria.setCuposDisponibles(request.getCuposDisponibles());
        if (request.getEstado() != null) {
            convocatoria.setEstado(request.getEstado());
        }
        if (request.getCategoriaIds() != null) {
            convocatoria.setCategorias(resolverCategorias(request.getCategoriaIds()));
        }

        return convocatoriaRepository.save(convocatoria);
    }

    public void eliminar(Long id) {
        convocatoriaRepository.delete(buscarPorId(id));
    }

    public List<Convocatoria> listarReportadas() {
        return convocatoriaRepository.findByReportadaTrue();
    }

    public Convocatoria reportar(Long id, String motivo) {
        Convocatoria convocatoria = buscarPorId(id);
        convocatoria.setReportada(true);
        convocatoria.setMotivoReporte(motivo);
        return convocatoriaRepository.save(convocatoria);
    }

    public Convocatoria desreportar(Long id) {
        Convocatoria convocatoria = buscarPorId(id);
        convocatoria.setReportada(false);
        convocatoria.setMotivoReporte(null);
        return convocatoriaRepository.save(convocatoria);
    }

    private Set<Categoria> resolverCategorias(Set<Long> categoriaIds) {
        if (categoriaIds == null || categoriaIds.isEmpty()) {
            return new HashSet<>();
        }

        Set<Categoria> categorias = new HashSet<>();
        for (Long categoriaId : categoriaIds) {
            categorias.add(categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoriaId)));
        }
        return categorias;
    }
}
