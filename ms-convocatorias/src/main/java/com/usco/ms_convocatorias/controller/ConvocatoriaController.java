package com.usco.ms_convocatorias.controller;

import com.usco.ms_convocatorias.convocatoria.Convocatoria;
import com.usco.ms_convocatorias.dto.ConvocatoriaRequest;
import com.usco.ms_convocatorias.service.ConvocatoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/convocatorias")
@RequiredArgsConstructor
public class ConvocatoriaController {

    private final ConvocatoriaService service;

    @GetMapping
    public List<Convocatoria> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Convocatoria buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Convocatoria crear(@RequestBody ConvocatoriaRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public Convocatoria actualizar(@PathVariable Long id, @RequestBody ConvocatoriaRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    @GetMapping("/reportadas")
    public List<Convocatoria> listarReportadas() {
        return service.listarReportadas();
    }

    @PutMapping("/{id}/reportar")
    public Convocatoria reportar(@PathVariable Long id, @RequestBody(required = false) String motivo) {
        return service.reportar(id, motivo);
    }

    @PutMapping("/{id}/desreportar")
    public Convocatoria desreportar(@PathVariable Long id) {
        return service.desreportar(id);
    }
}
