-- ============================================================
-- DATOS DE EJEMPLO - Sistema de Gestión de Convocatorias
-- ============================================================
-- Este script inserta datos de prueba para todas las entidades.
-- Orden: usuarios → categorias → convocatorias → convocatoria_categoria → postulaciones
--
-- Contraseña para todos los usuarios de ejemplo: 123456
-- ============================================================
-- ============================================================
-- 1. USUARIOS (6 registros)
-- Contraseña para todos: 123456
-- ============================================================
INSERT INTO usuarios (identificacion, nombre, correo, password, rol, estado, fecha_creacion, codigo_docente) VALUES
('10000001', 'Carlos Andrés Martínez', 'carlos.martinez@usco.edu.co', '$2a$10$gApLUWv2ZzjASGbHiffpmu9Z5piCIcstKgUEoP6LR0CM5v6TxrdS', 'ADMINISTRADOR', true, '2025-01-15 08:00:00', NULL),
('10000002', 'María Fernanda López', 'maria.lopez@usco.edu.co', '$2a$10$gApLUWv2ZzjASGbHiffpmu9Z5piCIcstKgUEoP6LR0CM5v6TxrdS', 'DOCENTE', true, '2025-01-20 09:30:00', 'DOC001'),
('10000003', 'Juan Carlos Pérez', 'juan.perez@usco.edu.co', '$2a$10$gApLUWv2ZzjASGbHiffpmu9Z5piCIcstKgUEoP6LR0CM5v6TxrdS', 'DOCENTE', true, '2025-02-01 10:00:00', 'DOC002'),
('10000004', 'Ana Sofía Ramírez', 'ana.ramirez@usco.edu.co', '$2a$10$gApLUWv2ZzjASGbHiffpmu9Z5piCIcstKgUEoP6LR0CM5v6TxrdS', 'ESTUDIANTE', true, '2025-02-10 07:45:00', NULL),
('10000005', 'Luis Eduardo Gómez', 'luis.gomez@usco.edu.co', '$2a$10$gApLUWv2ZzjASGbHiffpmu9Z5piCIcstKgUEoP6LR0CM5v6TxrdS', 'ESTUDIANTE', true, '2025-02-15 08:15:00', NULL),
('10000006', 'Valentina Castro', 'valentina.castro@usco.edu.co', '$2a$10$gApLUWv2ZzjASGbHiffpmu9Z5piCIcstKgUEoP6LR0CM5v6TxrdS', 'ESTUDIANTE', true, '2025-03-01 11:00:00', NULL);

-- ============================================================
-- 2. CATEGORÍAS (6 registros)
-- ============================================================
INSERT INTO categorias (nombre, descripcion) VALUES
('Investigación',       'Proyectos de investigación científica y tecnológica'),
('Innovación',          'Proyectos de innovación y transferencia tecnológica'),
('Desarrollo Tecnológico', 'Proyectos de desarrollo de software, hardware y prototipos'),
('Emprendimiento',      'Proyectos de emprendimiento y creación de empresas'),
('Extensión',           'Proyectos de extensión universitaria y proyección social'),
('Movilidad Académica', 'Proyectos de movilidad nacional e internacional');

-- ============================================================
-- 3. CONVOCATORIAS (6 registros)
-- ============================================================
INSERT INTO convocatorias (nombre, descripcion, fecha_inicio, fecha_fin, cupos_disponibles, estado, fecha_creacion) VALUES
('Convocatoria de Investigación 2025-I',
 'Convocatoria para financiar proyectos de investigación en todas las áreas del conocimiento. Dirigida a docentes y estudiantes de pregrado y posgrado.',
 '2025-03-01', '2025-05-30', 20, 'PUBLICADA',  '2025-02-20 08:00:00'),

('Convocatoria de Innovación 2025',
 'Convocatoria para proyectos de innovación tecnológica con impacto en el sector productivo de la región.',
 '2025-04-01', '2025-07-15', 15, 'PUBLICADA',  '2025-03-15 09:00:00'),

('Convocatoria de Emprendimiento 2025-I',
 'Apoyo a iniciativas de emprendimiento universitario con potencial de negocio.',
 '2025-05-01', '2025-08-30', 10, 'BORRADOR',   '2025-04-10 10:30:00'),

('Convocatoria de Extensión 2024',
 'Convocatoria para proyectos de extensión solidaria y proyección social ejecutados durante 2024.',
 '2024-02-01', '2024-06-30', 25, 'CERRADA',    '2024-01-15 07:00:00'),

('Convocatoria de Movilidad Académica 2025',
 'Convocatoria para apoyar la movilidad de estudiantes a universidades nacionales e internacionales.',
 '2025-06-01', '2025-09-30', 30, 'PUBLICADA',  '2025-05-15 08:00:00'),

('Convocatoria Desarrollo Tecnológico 2025',
 'Financiamiento para el desarrollo de prototipos tecnológicos y soluciones de ingeniería.',
 '2025-07-01', '2025-10-31', 12, 'BORRADOR',   '2025-06-01 11:00:00');

-- ============================================================
-- 4. RELACIÓN CONVOCATORIA - CATEGORÍA (9 registros)
-- ============================================================
INSERT INTO convocatoria_categoria (convocatoria_id, categoria_id) VALUES
(1, 1), -- Investigación 2025-I → Investigación
(2, 2), -- Innovación 2025 → Innovación
(2, 3), -- Innovación 2025 → Desarrollo Tecnológico
(3, 4), -- Emprendimiento 2025-I → Emprendimiento
(4, 5), -- Extensión 2024 → Extensión
(5, 6), -- Movilidad 2025 → Movilidad Académica
(6, 3), -- Desarrollo Tecnológico 2025 → Desarrollo Tecnológico
(6, 2), -- Desarrollo Tecnológico 2025 → Innovación
(1, 3); -- Investigación 2025-I → Desarrollo Tecnológico

-- ============================================================
-- 5. POSTULACIONES (7 registros)
-- ============================================================
INSERT INTO postulaciones (usuario_id, convocatoria_id, estado, fecha_postulacion) VALUES
(4, 1, 'APROBADA',  '2025-03-05 10:30:00'), -- Ana → Investigación 2025-I
(5, 1, 'PENDIENTE', '2025-03-10 14:15:00'), -- Luis → Investigación 2025-I
(6, 1, 'PENDIENTE', '2025-03-12 09:00:00'), -- Valentina → Investigación 2025-I
(4, 2, 'PENDIENTE', '2025-04-05 11:45:00'), -- Ana → Innovación 2025
(5, 2, 'RECHAZADA', '2025-04-08 16:30:00'), -- Luis → Innovación 2025
(6, 5, 'PENDIENTE', '2025-06-10 08:20:00'), -- Valentina → Movilidad 2025
(4, 5, 'PENDIENTE', '2025-06-12 10:00:00'); -- Ana → Movilidad 2025
