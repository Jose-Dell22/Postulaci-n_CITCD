package com.usco.ms_postulaciones.client;

import com.usco.ms_postulaciones.dto.ConvocatoriaDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(
        name = "ms-convocatorias",
        url = "${ms.convocatorias.url}"
)
public interface ConvocatoriaClient {

    @GetMapping("/api/convocatorias/{id}")
    ConvocatoriaDto obtenerPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization);
}
