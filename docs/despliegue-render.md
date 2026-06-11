# Despliegue en Render

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `gc-ms-usuarios` | 8080 | Autenticación JWT y CRUD de usuarios |
| `gc-ms-convocatorias` | 8081 | Convocatorias, categorías y reporte por categoría |
| `gc-ms-postulaciones` | 8082 | Postulaciones y reportes de resultados |
| `gc-api-gateway` | 8083 | Punto de entrada único `/api/**` |
| `gc-frontend` | — | Aplicación Angular (sitio estático) |

## Variables de entorno

Configurar el grupo `gc-database` en Render con:

- `DB_URL`: cadena JDBC de Supabase
- `DB_USER`: usuario de PostgreSQL
- `DB_PASSWORD`: contraseña

`JWT_SECRET` se genera en `gc-ms-usuarios` y se replica automáticamente a los demás microservicios mediante `render.yaml`.

## Despliegue

1. Conectar el repositorio de GitHub en Render.
2. Crear un **Blueprint** usando el archivo `render.yaml` en la raíz.
3. Completar las variables sensibles del grupo `gc-database`.
4. Ejecutar los scripts SQL de `docs/database/` en Supabase antes del primer arranque.
5. Actualizar `frontend/src/environments/environment.prod.ts` con la URL pública del API Gateway si es necesario.

## Desarrollo local

```bash
# Terminal 1
cd ms-usuarios && ./mvnw spring-boot:run

# Terminal 2
cd ms-convocatorias && ./mvnw spring-boot:run

# Terminal 3
cd ms-postulaciones && ./mvnw spring-boot:run

# Terminal 4
cd api-gateway && ./mvnw spring-boot:run

# Terminal 5
cd frontend && npm start
```

El frontend consume el gateway en `http://localhost:8083/api`.
