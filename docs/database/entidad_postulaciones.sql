CREATE TABLE postulaciones (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    convocatoria_id BIGINT NOT NULL REFERENCES convocatorias(id),
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, convocatoria_id)
);
