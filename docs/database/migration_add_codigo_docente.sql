-- Migración: Agregar campo codigo_docente y mejorar fecha_creacion
-- Ejecutar este script si la tabla usuarios ya existe con datos

-- 1. Agregar la columna codigo_docente si no existe
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS codigo_docente VARCHAR(50);

-- 2. Asegurar que fecha_creacion no sea null para registros existentes
UPDATE usuarios 
SET fecha_creacion = CURRENT_TIMESTAMP 
WHERE fecha_creacion IS NULL;

-- 3. Hacer fecha_creacion NOT NULL
ALTER TABLE usuarios
ALTER COLUMN fecha_creacion SET NOT NULL,
ALTER COLUMN fecha_creacion SET DEFAULT NOW();

-- Fin de la migración
