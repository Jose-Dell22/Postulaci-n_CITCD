# Sistema de Gestión de Convocatorias Institucionales

> **Prueba técnica — Universidad Surcolombiana (USCO)**
>
> Este proyecto es una aplicación de prueba full stack con microservicios Spring Boot + Angular. Los datos de prueba se insertan automáticamente al iniciar los backends (usuarios con contraseña `123456`, convocatorias, categorías y postulaciones). No está diseñado para uso en producción.

Aplicación full stack desarrollada para la Universidad Surcolombiana (USCO). Permite administrar convocatorias dirigidas a estudiantes, docentes y administrativos para participar en eventos, becas, monitorías, proyectos, capacitaciones y demás actividades institucionales.

El proyecto implementa una arquitectura de microservicios con Spring Boot en el backend, Angular en el frontend y PostgreSQL (Supabase) como base de datos relacional.

---

## Tabla de contenidos

--Antes de todo encontrarás todas las rutas
1. [Arquitectura](#arquitectura)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura del repositorio](#estructura-del-repositorio)
4. [Modelo de datos](#modelo-de-datos)
5. [Microservicios](#microservicios)
6. [API Gateway](#api-gateway)
7. [APIs REST](#apis-rest)
8. [Seguridad y autenticación](#seguridad-y-autenticación)
9. [Reglas de negocio](#reglas-de-negocio)
10. [Reportes](#reportes)
11. [Requisitos previos](#requisitos-previos)
12. [Configuración de la base de datos](#configuración-de-la-base-de-datos)
13. [Ejecución en desarrollo local](#ejecución-en-desarrollo-local)
14. [Frontend Angular](#frontend-angular)
15. [Variables de entorno](#variables-de-entorno)
16. [Despliegue en Render](#despliegue-en-render)
17. [Documentación adicional](#documentación-adicional)

---
====================================================
SISTEMA DE GESTIÓN DE CONVOCATORIAS - TODAS LAS RUTAS
====================================================

####################################################
# MICROSERVICIOS DIRECTOS
####################################################

-------------------------
AUTENTICACIÓN (8080)
-------------------------

POST   http://localhost:8080/api/auth/login
POST   http://localhost:8080/api/auth/register

-------------------------
USUARIOS (8080)
-------------------------

GET    http://localhost:8080/api/usuarios
GET    http://localhost:8080/api/usuarios/{id}
PUT    http://localhost:8080/api/usuarios/{id}
DELETE http://localhost:8080/api/usuarios/{id}

-------------------------
CONVOCATORIAS (8081)
-------------------------

GET    http://localhost:8081/api/convocatorias
GET    http://localhost:8081/api/convocatorias/{id}
POST   http://localhost:8081/api/convocatorias
PUT    http://localhost:8081/api/convocatorias/{id}
DELETE http://localhost:8081/api/convocatorias/{id}

-------------------------
CATEGORÍAS (8081)
-------------------------

GET    http://localhost:8081/api/categorias
GET    http://localhost:8081/api/categorias/{id}
POST   http://localhost:8081/api/categorias
PUT    http://localhost:8081/api/categorias/{id}
DELETE http://localhost:8081/api/categorias/{id}

-------------------------
POSTULACIONES (8082)
-------------------------

GET    http://localhost:8082/api/postulaciones
GET    http://localhost:8082/api/postulaciones/{id}
POST   http://localhost:8082/api/postulaciones
PUT    http://localhost:8082/api/postulaciones/{id}/estado

-------------------------
REPORTES
-------------------------

GET    http://localhost:8081/api/reportes/convocatorias-categoria
GET    http://localhost:8082/api/reportes/postulaciones-convocatoria
GET    http://localhost:8082/api/reportes/resultado-postulaciones


####################################################
# API GATEWAY (ARQUITECTURA COMPLETA)
####################################################

-------------------------
AUTENTICACIÓN
-------------------------

POST   http://localhost:8083/api/auth/login
POST   http://localhost:8083/api/auth/register

-------------------------
USUARIOS
-------------------------

GET    http://localhost:8083/api/usuarios
GET    http://localhost:8083/api/usuarios/{id}
PUT    http://localhost:8083/api/usuarios/{id}
DELETE http://localhost:8083/api/usuarios/{id}

-------------------------
CONVOCATORIAS
-------------------------

GET    http://localhost:8083/api/convocatorias
GET    http://localhost:8083/api/convocatorias/{id}
POST   http://localhost:8083/api/convocatorias
PUT    http://localhost:8083/api/convocatorias/{id}
DELETE http://localhost:8083/api/convocatorias/{id}

-------------------------
CATEGORÍAS
-------------------------

GET    http://localhost:8083/api/categorias
GET    http://localhost:8083/api/categorias/{id}
POST   http://localhost:8083/api/categorias
PUT    http://localhost:8083/api/categorias/{id}
DELETE http://localhost:8083/api/categorias/{id}

-------------------------
POSTULACIONES
-------------------------

GET    http://localhost:8083/api/postulaciones
GET    http://localhost:8083/api/postulaciones/{id}
POST   http://localhost:8083/api/postulaciones
PUT    http://localhost:8083/api/postulaciones/{id}/estado

-------------------------
REPORTES
-------------------------

GET    http://localhost:8083/api/reportes/convocatorias-categoria
GET    http://localhost:8083/api/reportes/postulaciones-convocatoria
GET    http://localhost:8083/api/reportes/resultado-postulaciones


####################################################
# HEADER PARA ENDPOINTS PROTEGIDOS
####################################################

Authorization: Bearer <TOKEN_JWT>


####################################################
# ENDPOINTS PÚBLICOS
####################################################

POST http://localhost:8080/api/auth/login
POST http://localhost:8080/api/auth/register

POST http://localhost:8083/api/auth/login
POST http://localhost:8083/api/auth/register

####################################################
# FLUJO DE PRUEBA RECOMENDADO
####################################################

1. POST /auth/login
2. GET /usuarios
3. GET /categorias
4. GET /convocatorias
5. POST /convocatorias
6. POST /postulaciones
7. PUT /postulaciones/{id}/estado
8. GET /reportes/*
## Arquitectura

El sistema sigue el patrón de microservicios reales (Opción B de la prueba técnica). Cada dominio de negocio corre en un servicio independiente y se comunican entre sí mediante REST. Un API Gateway actúa como punto de entrada único para el cliente.

```
                    +------------------+
                    |  Frontend Angular |
                    |     (puerto 4200) |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |   API Gateway    |
                    |   (puerto 8083)  |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
+----------------+  +----------------+  +----------------+
|  ms-usuarios   |  |ms-convocatorias|  |ms-postulaciones|
|  (puerto 8080) |  | (puerto 8081)  |  | (puerto 8082)  |
+-------+--------+  +-------+--------+  +-------+--------+
        |                   |                   |
        |                   |    Feign REST     |
        |                   |<------------------+
        |                   |                   |
        +-------------------+-------------------+
                            |
                            v
                  +-------------------+
                  | Supabase / PostgreSQL |
                  +-------------------+
```

| Servicio            | Puerto | Responsabilidad                                      |
|---------------------|--------|------------------------------------------------------|
| `ms-usuarios`       | 8080   | Autenticación JWT, registro y CRUD de usuarios       |
| `ms-convocatorias`  | 8081   | Convocatorias, categorías y reporte por categoría    |
| `ms-postulaciones`  | 8082   | Postulaciones, validaciones y reportes de resultados |
| `api-gateway`       | 8083   | Enrutamiento, CORS y punto de entrada `/api/**`    |
| `frontend`          | 4200   | Interfaz web Angular con login y dashboard           |

---

## Stack tecnológico

### Backend
- Java 21
- Spring Boot 3.5
- Spring Security + JWT (jjwt 0.12)
- Spring Data JPA
- Spring Cloud Gateway
- Spring Cloud OpenFeign (comunicación entre microservicios)
- PostgreSQL
- Maven

### Frontend
- Angular 19
- Angular Material
- Formularios reactivos
- HttpClient con interceptor JWT

### Base de datos e infraestructura
- PostgreSQL (Supabase)
- Docker (imágenes por microservicio)
- Render (despliegue en la nube)

---

## Estructura del repositorio

```
gestion_convocatorias/
├── api-gateway/              # Spring Cloud Gateway
├── ms-usuarios/              # Microservicio de autenticación y usuarios
├── ms-convocatorias/         # Microservicio de convocatorias y categorías
├── ms-postulaciones/         # Microservicio de postulaciones y reportes
├── frontend/                 # Aplicación Angular
├── docs/
│   ├── database/             # DER, scripts SQL y configuración Supabase
│   └── despliegue-render.md  # Guía de despliegue
├── render.yaml               # Blueprint de servicios en Render
├── .env.example              # Plantilla de variables de entorno
└── README.md
```

---

## Modelo de datos

El diagrama entidad-relación se encuentra en `docs/database/DER-v1.puml`. La imagen generada está en `docs/database/DER_Gestion_Convocatorias.png`.

### Entidades principales

**usuarios**
| Campo            | Tipo         | Descripción                        |
|------------------|--------------|------------------------------------|
| id               | BIGSERIAL    | Clave primaria                     |
| identificacion   | VARCHAR(20)  | Documento de identidad             |
| nombre           | VARCHAR(150) | Nombre completo                    |
| correo           | VARCHAR(150) | Correo electrónico (único)         |
| password         | VARCHAR(255) | Contraseña cifrada (BCrypt)        |
| rol              | VARCHAR(30)  | ADMINISTRADOR, DOCENTE, ESTUDIANTE |
| estado           | BOOLEAN      | Activo / inactivo                  |
| fecha_creacion   | TIMESTAMP    | Fecha de registro                  |

**convocatorias**
| Campo              | Tipo         | Descripción                              |
|--------------------|--------------|------------------------------------------|
| id                 | BIGSERIAL    | Clave primaria                           |
| nombre             | VARCHAR(200) | Título de la convocatoria                |
| descripcion        | TEXT         | Descripción detallada                    |
| fecha_inicio       | DATE         | Fecha de apertura                        |
| fecha_fin          | DATE         | Fecha de cierre                          |
| cupos_disponibles  | INTEGER      | Número máximo de participantes           |
| estado             | VARCHAR(30)  | BORRADOR, PUBLICADA, CERRADA             |
| fecha_creacion     | TIMESTAMP    | Fecha de creación                        |

**categorias**
| Campo        | Tipo          | Descripción                    |
|--------------|---------------|--------------------------------|
| id           | BIGSERIAL     | Clave primaria                 |
| nombre       | VARCHAR(100)  | Nombre único (ej. Académica)   |
| descripcion  | VARCHAR(255)  | Descripción de la categoría    |

**convocatoria_categoria** (relación N:M)
| Campo            | Tipo    | Descripción                    |
|------------------|---------|--------------------------------|
| convocatoria_id  | BIGINT  | FK a convocatorias             |
| categoria_id     | BIGINT  | FK a categorias                |

**postulaciones**
| Campo              | Tipo         | Descripción                              |
|--------------------|--------------|------------------------------------------|
| id                 | BIGSERIAL    | Clave primaria                           |
| usuario_id         | BIGINT       | FK a usuarios                            |
| convocatoria_id    | BIGINT       | FK a convocatorias                       |
| estado             | VARCHAR(30)  | PENDIENTE, APROBADA, RECHAZADA           |
| fecha_postulacion  | TIMESTAMP    | Fecha en que el estudiante se postuló    |

Restricción única: un usuario no puede postularse dos veces a la misma convocatoria.

---

## Microservicios

### ms-usuarios

Gestiona la identidad y el acceso al sistema.

- Registro de nuevos usuarios (`POST /api/auth/register`)
- Inicio de sesión con emisión de token JWT (`POST /api/auth/login`)
- CRUD de usuarios (`/api/usuarios`)
- Cifrado de contraseñas con BCrypt
- Filtro JWT para proteger endpoints internos

### ms-convocatorias

Administra el catálogo de convocatorias y sus categorías.

- CRUD completo de convocatorias
- CRUD completo de categorías
- Asociación N:M entre convocatorias y categorías
- Reporte de convocatorias agrupadas por categoría
- Validación JWT con la clave compartida del sistema

### ms-postulaciones

Gestiona el proceso de postulación de estudiantes.

- Registro y consulta de postulaciones
- Cambio de estado (aprobar / rechazar) por administradores
- Validaciones de negocio al crear y aprobar postulaciones
- Comunicación REST con `ms-convocatorias` mediante OpenFeign para verificar estado y cupos
- Reportes de postulaciones por convocatoria y por resultado

---

## API Gateway

El gateway (`api-gateway`) centraliza todas las peticiones del frontend y clientes externos en el puerto `8083`. Configura CORS para permitir el origen del frontend Angular y enruta cada ruta al microservicio correspondiente.

| Ruta                                              | Destino              |
|---------------------------------------------------|----------------------|
| `/api/auth/**`                                    | ms-usuarios          |
| `/api/usuarios/**`                                | ms-usuarios          |
| `/api/convocatorias/**`, `/api/categorias/**`     | ms-convocatorias     |
| `/api/reportes/convocatorias-categoria`           | ms-convocatorias     |
| `/api/postulaciones/**`                           | ms-postulaciones     |
| `/api/reportes/postulaciones-convocatoria`        | ms-postulaciones     |
| `/api/reportes/resultado-postulaciones`           | ms-postulaciones     |

---

## APIs REST

Todas las rutas (excepto login y registro) requieren el header:

```
Authorization: Bearer <token_jwt>
```

### Autenticación

| Método | Ruta                  | Descripción              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/register`  | Registrar nuevo usuario  |
| POST   | `/api/auth/login`     | Iniciar sesión           |

### Usuarios

| Método | Ruta                    | Descripción           |
|--------|-------------------------|-----------------------|
| GET    | `/api/usuarios`         | Listar usuarios       |
| GET    | `/api/usuarios/{id}`    | Obtener por ID        |
| PUT    | `/api/usuarios/{id}`    | Actualizar usuario    |
| DELETE | `/api/usuarios/{id}`    | Eliminar usuario      |

### Convocatorias

| Método | Ruta                        | Descripción              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/convocatorias`        | Listar convocatorias     |
| GET    | `/api/convocatorias/{id}`   | Obtener por ID           |
| POST   | `/api/convocatorias`        | Crear convocatoria       |
| PUT    | `/api/convocatorias/{id}`   | Actualizar convocatoria  |
| DELETE | `/api/convocatorias/{id}`   | Eliminar convocatoria    |

### Categorías

| Método | Ruta                     | Descripción           |
|--------|--------------------------|-----------------------|
| GET    | `/api/categorias`        | Listar categorías     |
| GET    | `/api/categorias/{id}`   | Obtener por ID        |
| POST   | `/api/categorias`        | Crear categoría       |
| PUT    | `/api/categorias/{id}`   | Actualizar categoría  |
| DELETE | `/api/categorias/{id}`   | Eliminar categoría    |

### Postulaciones

| Método | Ruta                              | Descripción                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/postulaciones`              | Listar postulaciones           |
| GET    | `/api/postulaciones/{id}`         | Obtener por ID                 |
| POST   | `/api/postulaciones`              | Crear postulación              |
| PUT    | `/api/postulaciones/{id}/estado`  | Aprobar o rechazar postulación |

Cuerpo de ejemplo para crear postulación:

```json
{
  "usuarioId": 1,
  "convocatoriaId": 2
}
```

Cuerpo de ejemplo para cambiar estado:

```json
{
  "estado": "APROBADA"
}
```

---

## Seguridad y autenticación

El sistema utiliza autenticación basada en JWT (JSON Web Token):

1. El usuario envía correo y contraseña a `POST /api/auth/login`.
2. `ms-usuarios` valida las credenciales y devuelve un token firmado con `JWT_SECRET`.
3. El cliente incluye el token en el header `Authorization: Bearer <token>` en cada petición subsiguiente.
4. Cada microservicio valida la firma y la expiración del token de forma independiente.
5. El frontend Angular almacena el token en `localStorage` y lo adjunta automáticamente mediante un interceptor HTTP.

La clave `JWT_SECRET` debe ser idéntica en todos los microservicios. En Render se genera en `ms-usuarios` y se propaga al resto mediante `render.yaml`.

---

## Reglas de negocio

### Postulaciones

Al crear una postulación, el sistema valida:

- El estudiante no puede postularse dos veces a la misma convocatoria.
- No se permite postular a convocatorias en estado `CERRADA`.
- No se puede exceder el número de `cupos_disponibles` (cuenta postulaciones en estado `PENDIENTE` o `APROBADA`).

Al aprobar una postulación:

- Se verifica nuevamente que no se superen los cupos disponibles de la convocatoria.

### Convocatorias

Estados posibles:

| Estado      | Descripción                                      |
|-------------|--------------------------------------------------|
| BORRADOR    | Convocatoria en edición, no visible al público   |
| PUBLICADA   | Convocatoria activa y abierta a postulaciones    |
| CERRADA     | Convocatoria finalizada, no admite postulaciones |

### Postulaciones (estados)

| Estado     | Descripción                              |
|------------|------------------------------------------|
| PENDIENTE  | Postulación registrada, en revisión      |
| APROBADA   | Postulación aceptada por el administrador|
| RECHAZADA  | Postulación rechazada                    |

---

## Reportes

| Endpoint                                      | Microservicio      | Descripción                                      |
|-----------------------------------------------|--------------------|--------------------------------------------------|
| `GET /api/reportes/convocatorias-categoria`   | ms-convocatorias   | Cantidad de convocatorias por categoría          |
| `GET /api/reportes/postulaciones-convocatoria`| ms-postulaciones   | Cantidad de postulaciones por convocatoria       |
| `GET /api/reportes/resultado-postulaciones`   | ms-postulaciones   | Total de postulaciones aprobadas y rechazadas    |

---

## Requisitos previos

- Java 21 (JDK). **Configure `JAVA_HOME` apuntando al JDK 21**, no al JRE 8. Si Maven falla con `class file version 61.0`, ejecute `. .\scripts\set-java.ps1` en PowerShell antes de compilar.
- Maven 3.9+ (incluido wrapper `mvnw` en cada servicio)
- Node.js 22 y npm
- Angular CLI 19 (`npm install -g @angular/cli`)
- Cuenta en Supabase con base de datos PostgreSQL configurada
- Git

---

## Configuración de la base de datos

Los scripts SQL se encuentran en `docs/database/`. Ejecutarlos en Supabase en el siguiente orden:

1. `entidad_usuarios.sql`
2. `entidad_convocatorias.sql`
3. `entidad_postulaciones.sql`

También existe `schema-v1.sql` como referencia del script completo.

Configuración de conexión Supabase: ver `docs/database/supabase-config.md`.

---

## Ejecución en desarrollo local

### 1. Configurar variables de entorno

Copiar `.env.example` a `.env` y completar `DB_PASSWORD` con la contraseña de Supabase (ver `docs/database/supabase-config.md`).

En cada terminal de backend, cargar Java 21 y las variables:

```powershell
. .\scripts\load-env.ps1
```

### 2. Iniciar los microservicios

Abrir una terminal por cada servicio:

```powershell
# Terminal 1 - Usuarios
cd ms-usuarios
.\mvnw.cmd spring-boot:run

# Terminal 2 - Convocatorias
cd ms-convocatorias
.\mvnw.cmd spring-boot:run

# Terminal 3 - Postulaciones
cd ms-postulaciones
.\mvnw.cmd spring-boot:run

# Terminal 4 - API Gateway
cd api-gateway
.\mvnw.cmd spring-boot:run
```

### 3. Verificar servicios

| Servicio          | URL de prueba                        |
|-------------------|--------------------------------------|
| ms-usuarios       | http://localhost:8080/api/auth/login |
| ms-convocatorias  | http://localhost:8081                |
| ms-postulaciones  | http://localhost:8082                |
| API Gateway       | http://localhost:8083/api            |

---

## Frontend Angular

### Instalación y ejecución

```powershell
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

### Funcionalidades implementadas

- Pantalla de login con formulario reactivo y validaciones
- Almacenamiento y envío automático del token JWT
- Guard de rutas para proteger las vistas autenticadas
- Dashboard de bienvenida con acceso por rol
- Consumo de APIs a través del gateway (`http://localhost:8083/api`)
- Inserción automática de datos de prueba al iniciar (6 usuarios, 6 categorías, 6 convocatorias, 7 postulaciones)

### Rutas del frontend

| Ruta                  | Componente              | Roles                      | Descripción                                |
|-----------------------|-------------------------|----------------------------|--------------------------------------------|
| `/`                   | InicioComponent         | Público                    | Página de bienvenida                       |
| `/login`              | LoginComponent          | Público                    | Inicio de sesión                           |
| `/registro`           | RegisterComponent       | Público                    | Registro de nuevo usuario                  |
| `/dashboard`          | DashboardComponent      | Autenticado                | Panel principal con acceso por rol         |
| `/convocatorias`      | ConvocatoriasComponent  | Autenticado                | CRUD y listado de convocatorias            |
| `/convocatorias/:id`  | ConvocatoriaDetailComponent | Autenticado            | Detalle completo de una convocatoria       |
| `/postulaciones`      | PostulacionesComponent  | Autenticado                | Listado de postulaciones                   |
| `/categorias`         | CategoriasComponent     | Autenticado                | CRUD y listado de categorías               |
| `/usuarios`           | UsuariosComponent       | ADMINISTRADOR              | Listado y eliminación de usuarios          |
| `/reportes`           | ReportesComponent       | ADMINISTRADOR, DOCENTE     | Métricas y convocatorias reportadas        |
| `**`                  | —                       | Público                    | Redirige a `/`                             |

### Datos de prueba

Al iniciar los microservicios, los `DataInitializer` insertan registros de prueba automáticamente (solo si la base de datos está vacía):

| Microservicio      | Registros insertados                          | Contraseña    |
|--------------------|-----------------------------------------------|---------------|
| ms-usuarios        | 6 usuarios (admin, docentes, estudiantes)     | `123456`      |
| ms-convocatorias   | 6 categorías y 6 convocatorias con relaciones | —             |
| ms-postulaciones   | 7 postulaciones vinculadas a usuarios y convs | —             |

### Estructura del frontend

```
frontend/src/app/
├── core/
│   ├── guards/          # authGuard
│   ├── interceptors/    # authInterceptor (adjunta JWT)
│   ├── models/          # interfaces TypeScript
│   └── services/        # AuthService
└── features/
    ├── auth/login/      # Componente de inicio de sesión
    └── dashboard/       # Panel principal
```

### Build de producción

```powershell
cd frontend
npm run build
```

Los archivos generados quedan en `frontend/dist/frontend/browser`.

---

## Variables de entorno

| Variable              | Descripción                                      | Ejemplo local                        |
|-----------------------|--------------------------------------------------|--------------------------------------|
| `DB_URL`              | Cadena JDBC de PostgreSQL                        | `jdbc:postgresql://HOST:5432/postgres`|
| `DB_USER`             | Usuario de la base de datos                      | `postgres`                           |
| `DB_PASSWORD`         | Contraseña de la base de datos                   | —                                    |
| `JWT_SECRET`          | Clave secreta para firmar tokens JWT             | Cadena segura compartida             |
| `JWT_EXPIRATION`      | Expiración del token en milisegundos             | `86400000` (24 horas)                |
| `SERVER_PORT`         | Puerto del servicio                              | `8080`, `8081`, `8082`, `8083`       |
| `MS_USUARIOS_URL`     | URL interna de ms-usuarios (gateway/postulaciones)| `http://localhost:8080`            |
| `MS_CONVOCATORIAS_URL`| URL interna de ms-convocatorias                  | `http://localhost:8081`              |
| `MS_POSTULACIONES_URL`| URL interna de ms-postulaciones                  | `http://localhost:8082`              |
| `CORS_ORIGINS`        | Origen permitido para CORS en el gateway         | `http://localhost:4200`              |

Referencia completa en `.env.example`.

---

## Despliegue en Render

El archivo `render.yaml` define un Blueprint con cinco servicios:

| Servicio Render         | Tipo     | Descripción                    |
|-------------------------|----------|--------------------------------|
| `gc-ms-usuarios`        | Docker   | Microservicio de usuarios      |
| `gc-ms-convocatorias`   | Docker   | Microservicio de convocatorias |
| `gc-ms-postulaciones`   | Docker   | Microservicio de postulaciones |
| `gc-api-gateway`        | Docker   | API Gateway                    |
| `gc-frontend`           | Estático | Build de Angular               |

### Pasos de despliegue

1. Conectar el repositorio de GitHub en [Render](https://render.com).
2. Crear un nuevo Blueprint apuntando al archivo `render.yaml`.
3. Configurar el grupo de variables `gc-database` con `DB_URL`, `DB_USER` y `DB_PASSWORD` de Supabase.
4. Ejecutar los scripts SQL en Supabase antes del primer arranque.
5. Actualizar `frontend/src/environments/environment.prod.ts` con la URL pública del gateway si es necesario.

Guía detallada: `docs/despliegue-render.md`.

---

## Documentación adicional

| Recurso                              | Ubicación                              |
|--------------------------------------|----------------------------------------|
| Manual de usuario                    | `MANUAL.md`                            |
| Diagrama entidad-relación (PlantUML) | `docs/database/DER-v1.puml`            |
| Imagen del DER                       | `docs/database/DER_Gestion_Convocatorias.png` |
| Scripts SQL por entidad              | `docs/database/entidad_*.sql`          |
| Configuración Supabase               | `docs/database/supabase-config.md`     |
| Guía de despliegue Render            | `docs/despliegue-render.md`            |
| Plantilla de variables de entorno    | `.env.example`                         |

---

## Licencia

Proyecto académico desarrollado como prueba técnica para la Universidad Surcolombiana.
