# Resumen de Cambios - Corrección de Registro de Usuarios

## Problemas Identificados y Solucionados

### 1. **Fecha de Creación Quedaba NULL ✅ SOLUCIONADO**

**Problema**: Al registrar un usuario nuevo, el campo `fecha_creacion` quedaba NULL.

**Solución Implementada**:
- Se agregó `import java.time.LocalDateTime;` en `AuthService`
- Se asigna automáticamente: `.fechaCreacion(LocalDateTime.now())`
- Se actualiza el script SQL para usar `DEFAULT NOW()` en lugar de `CURRENT_TIMESTAMP`

**Archivo modificado**: `ms-usuarios/src/main/java/com/usco/ms_usuarios/service/AuthService.java`

### 2. **Campo Código de Docente No Existía ✅ SOLUCIONADO**

**Problema**: No había forma de almacenar el código de docente en la BD.

**Solución Implementada**:
- Se agregó la columna `codigo_docente` a la entidad `Usuario`
- Se configura automáticamente el rol:
  - Si hay código de docente → Rol `DOCENTE`
  - Si está vacío → Rol `ESTUDIANTE`
- Se guarda el código solo si no está vacío (evita espacios en blanco)

**Archivos modificados**:
- `ms-usuarios/src/main/java/com/usco/ms_usuarios/usuario/Usuario.java` (agregada columna)
- `ms-usuarios/src/main/java/com/usco/ms_usuarios/service/AuthService.java` (lógica)

### 3. **Script SQL Actualizado ✅ LISTO**

**Cambios en BD**:
```sql
-- Nueva estructura (para BD nueva)
CREATE TABLE usuarios (
    ...
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    codigo_docente VARCHAR(50)
);

-- Script de migración para BD existente
-- Ver: docs/database/migration_add_codigo_docente.sql
```

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `ms-usuarios/src/main/java/com/usco/ms_usuarios/usuario/Usuario.java` | ✅ Agregado campo `codigoDocente` |
| `ms-usuarios/src/main/java/com/usco/ms_usuarios/service/AuthService.java` | ✅ Agregado import de LocalDateTime y lógica de fechas/docente |
| `docs/database/entidad_usuarios.sql` | ✅ Actualizada estructura con `codigo_docente` y `DEFAULT NOW()` |
| `docs/database/migration_add_codigo_docente.sql` | ✅ Nuevo archivo (migración para BD existente) |
| `docs/database/MIGRACION_USUARIOS.md` | ✅ Nuevo archivo (instrucciones de migración) |

## Estado de Compilación

✅ **BUILD SUCCESS** - El código Java compila sin errores

## Próximos Pasos

### 1. **Ejecutar Migración en la BD**

Si ya tienes usuarios registrados:
```sql
\i docs/database/migration_add_codigo_docente.sql
```

Si es BD nueva, ejecuta el script completo:
```sql
\i docs/database/schema-v1.sql
```

### 2. **Reiniciar el Microservicio**

Detener y reiniciar `ms-usuarios`:
```powershell
# En una terminal nueva
cd ms-usuarios
.\mvnw.cmd mvn spring-boot:run
```

### 3. **Probar en el Frontend**

1. Ir a http://localhost:4200/registro
2. Registrar un nuevo usuario (sin código de docente)
   - Deberá tener rol: `ESTUDIANTE`
   - Fecha de creación: Rellenada automáticamente
3. Registrar un usuario con código de docente (ej: DOC001)
   - Deberá tener rol: `DOCENTE`
   - Código guardado: `DOC001`

## Código Clave del AuthService

```java
public AuthResponse register(RegisterRequest request) {
    // Determinar rol según código de docente
    Rol rol = (request.getCodigoDocente() != null && !request.getCodigoDocente().isBlank())
            ? Rol.DOCENTE
            : Rol.ESTUDIANTE;

    // Guardar código solo si no está vacío
    String codigoDocenteValue = (request.getCodigoDocente() != null && !request.getCodigoDocente().isBlank())
            ? request.getCodigoDocente()
            : null;

    // Crear usuario con TODOS los campos necesarios
    Usuario usuario = Usuario.builder()
            .identificacion(request.getIdentificacion())
            .nombre(request.getNombre())
            .correo(request.getCorreo())
            .password(encoder.encode(request.getPassword()))
            .rol(rol)
            .estado(true)
            .fechaCreacion(LocalDateTime.now())  // ✅ Fecha automática
            .codigoDocente(codigoDocenteValue)    // ✅ Código de docente
            .build();

    repository.save(usuario);
    String token = jwtService.generateToken(usuario);
    return new AuthResponse(token);
}
```

## Verificación

Después de ejecutar la migración, puedes verificar en Supabase:

```sql
SELECT id, nombre, correo, rol, codigo_docente, fecha_creacion 
FROM usuarios 
ORDER BY fecha_creacion DESC 
LIMIT 10;
```

Deberías ver:
- ✅ `fecha_creacion` con valores reales (no NULL)
- ✅ `codigo_docente` con valores para docentes, NULL para estudiantes
- ✅ `rol` correcto (DOCENTE o ESTUDIANTE)
