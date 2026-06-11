package com.usco.ms_postulaciones.controller;

import com.usco.ms_postulaciones.dto.EstadoPostulacionRequest;
import com.usco.ms_postulaciones.dto.PostulacionRequest;
import com.usco.ms_postulaciones.postulacion.Postulacion;
import com.usco.ms_postulaciones.service.PostulacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
public class PostulacionController {

    private final PostulacionService service;

    @GetMapping
    public List<Postulacion> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Postulacion buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Postulacion crear(@RequestBody PostulacionRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}/estado")
    public Postulacion actualizarEstado(
            @PathVariable Long id,
            @RequestBody EstadoPostulacionRequest request) {
        return service.actualizarEstado(id, request.getEstado());
    }
}
