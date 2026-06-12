# Manual de usuario

Guía práctica para instalar, acceder y utilizar el Sistema de Gestión de Convocatorias Institucionales de la Universidad Surcolombiana.

Para detalles técnicos del proyecto (arquitectura, código, despliegue), consulte el archivo `README.md`.

---

## Tabla de contenidos

1. [¿Qué hace esta aplicación?](#qué-hace-esta-aplicación)
2. [Roles del sistema](#roles-del-sistema)
3. [Requisitos para usar la aplicación](#requisitos-para-usar-la-aplicación)
4. [Poner en marcha la aplicación](#poner-en-marcha-la-aplicación)
5. [Acceder al sistema](#acceder-al-sistema)
6. [Pantallas de la interfaz web](#pantallas-de-la-interfaz-web)
7. [Flujos de trabajo por rol](#flujos-de-trabajo-por-rol)
8. [Módulo: Usuarios](#módulo-usuarios)
9. [Módulo: Categorías](#módulo-categorías)
10. [Módulo: Convocatorias](#módulo-convocatorias)
11. [Módulo: Postulaciones](#módulo-postulaciones)
12. [Módulo: Reportes](#módulo-reportes)
13. [Uso de la API con Postman o Insomnia](#uso-de-la-api-con-postman-o-insomnia)
14. [Mensajes de error frecuentes](#mensajes-de-error-frecuentes)
15. [Preguntas frecuentes](#preguntas-frecuentes)

---

## ¿Qué hace esta aplicación?

El sistema permite a la institución:

- Registrar y administrar usuarios con distintos roles.
- Crear convocatorias institucionales (becas, monitorías, eventos, capacitaciones, etc.).
- Clasificar convocatorias en categorías (Académica, Bienestar, Deportiva, Cultural, Investigación, entre otras).
- Permitir que los estudiantes se postulen a convocatorias abiertas.
- Que los administradores revisen, aprueben o rechacen postulaciones.
- Consultar reportes sobre convocatorias y postulaciones.

---

## Roles del sistema

| Rol             | Descripción general                                              |
|-----------------|------------------------------------------------------------------|
| ADMINISTRADOR   | Gestiona usuarios, convocatorias, categorías, postulaciones y reportes. |
| DOCENTE         | Consulta convocatorias y categorías. Puede participar según políticas institucionales. |
| ESTUDIANTE      | Consulta convocatorias publicadas y puede postularse a ellas.    |

Al registrarse por primera vez, un usuario recibe automáticamente el rol **ESTUDIANTE**. Un administrador puede cambiar el rol posteriormente.

---

## Requisitos para usar la aplicación

### Si la usa en su equipo (desarrollo local)

- Tener Java 21, Node.js 22 y npm instalados.
- Tener la base de datos PostgreSQL configurada en Supabase con las tablas creadas (ver `README.md`, sección de base de datos).
- Tener los cuatro servicios backend y el frontend en ejecución (instrucciones en la siguiente sección).

### Si la usa en producción (Render)

- Contar con la URL pública del frontend y del API Gateway proporcionadas tras el despliegue.
- Tener credenciales de acceso (correo y contraseña) creadas previamente.

---

## Poner en marcha la aplicación

### Desarrollo local

Abra **cinco terminales** y ejecute en cada una.

> **Antes de iniciar los backends**, en cada terminal de microservicio ejecute:
>
> ```powershell
> . ..\scripts\load-env.ps1
> ```
>
> (Desde la raíz: `. .\scripts\load-env.ps1`). Este script configura **Java 21** (requerido por Spring Boot 3.5) y carga las variables de `.env`. Si no tiene `.env`, copie `.env.example` a `.env` y complete `DB_PASSWORD` con su contraseña de Supabase.

```powershell
# Terminal 1
cd ms-usuarios
.\mvnw.cmd mvn spring-boot:run

# Terminal 2
cd ms-convocatorias
.\mvnw.cmd mvn spring-boot:run

# Terminal 3
cd ms-postulaciones
.\mvnw.cmd mvn spring-boot:run

# Terminal 4
cd api-gateway
.\mvnw.cmd mvn spring-boot:run

# Terminal 5
cd frontend
npm install
npm start
```
#o hacer los siguiente
.\scripts\start-all.ps1
#o hacer los siguiente
Antes de iniciar, configure las variables de entorno de base de datos y JWT (copie `.env.example` y asigne los valores en su sistema o en cada terminal).

### Direcciones de acceso en local

| Recurso        | Dirección                          |
|----------------|------------------------------------|
| Aplicación web | http://localhost:4200              |
| API (gateway)  | http://localhost:8083/api          |

Espere a que todos los servicios terminen de arrancar antes de intentar iniciar sesión.

---

## Acceder al sistema

### Paso 1: Abrir la aplicación web

Ingrese en el navegador a la URL del frontend:

- **Local:** http://localhost:4200
- **Producción:** la URL asignada por Render al servicio `gc-frontend`

Será redirigido automáticamente al inicio de sesión si no tiene una sesión activa.

### Paso 2: Crear una cuenta (primer uso)

Si aún no tiene usuario, regístrese mediante la API antes de poder ingresar por la web:

**Petición**

```
POST http://localhost:8083/api/auth/register
Content-Type: application/json
```

**Cuerpo de ejemplo**

```json
{
  "identificacion": "1234567890",
  "nombre": "Juan Pérez",
  "correo": "juan.perez@usco.edu.co",
  "password": "MiClave123"
}
```

La respuesta incluirá un `token`. Guárdelo si va a probar la API directamente; para la web solo necesita el correo y la contraseña.

### Paso 3: Iniciar sesión

1. En la pantalla de login, ingrese su **correo electrónico**.
2. Ingrese su **contraseña**.
3. Presione el botón **Ingresar**.

Si las credenciales son correctas, accederá al **Dashboard**. Si son incorrectas, verá el mensaje: *"Credenciales inválidas. Intente nuevamente."*

### Paso 4: Cerrar sesión

En la barra superior del Dashboard, haga clic en **Cerrar sesión**. Será devuelto a la pantalla de login y el token almacenado se eliminará.

---

## Pantallas de la interfaz web

### Login (`/login`)

Formulario con dos campos obligatorios:

- **Correo:** debe ser un correo electrónico válido.
- **Contraseña:** la definida al registrarse.

### Dashboard (`/dashboard`)

Pantalla principal tras autenticarse. Muestra:

- Barra superior con el nombre del sistema y su correo de sesión.
- Mensaje de bienvenida.
- Acceso a **Cerrar sesión**.

> **Nota:** Los módulos de usuarios, convocatorias, categorías, postulaciones y reportes están disponibles a través de la API. Las pantallas de gestión visual se irán incorporando al frontend; mientras tanto, utilice Postman o Insomnia siguiendo las instrucciones de este manual.

---

## Flujos de trabajo por rol

### Administrador: configurar el sistema desde cero

1. Iniciar sesión con una cuenta de administrador.
2. Crear categorías (Académica, Bienestar, Deportiva, etc.).
3. Crear convocatorias y asociarles una o varias categorías.
4. Cambiar el estado de la convocatoria a `PUBLICADA` cuando esté lista.
5. Revisar las postulaciones recibidas.
6. Aprobar o rechazar cada postulación.
7. Consultar los reportes del sistema.

### Estudiante: postularse a una convocatoria

1. Iniciar sesión con su cuenta de estudiante.
2. Consultar las convocatorias disponibles (estado `PUBLICADA`).
3. Elegir una convocatoria con cupos disponibles.
4. Enviar la postulación indicando su `usuarioId` y el `convocatoriaId`.
5. Esperar la revisión del administrador (estado `PENDIENTE` hasta que sea `APROBADA` o `RECHAZADA`).

### Docente: consultar convocatorias

1. Iniciar sesión.
2. Listar convocatorias y categorías para conocer las oportunidades institucionales vigentes.

---

## Módulo: Usuarios

Permite al administrador gestionar las cuentas del sistema.

### Datos de un usuario

| Campo            | Descripción                    |
|------------------|--------------------------------|
| Identificación   | Documento de identidad         |
| Nombre           | Nombre completo                |
| Correo           | Correo electrónico (único)     |
| Rol              | ADMINISTRADOR, DOCENTE o ESTUDIANTE |
| Estado           | Activo (`true`) o inactivo (`false`) |

### Operaciones disponibles

| Acción              | Método y ruta                    |
|---------------------|----------------------------------|
| Listar usuarios     | `GET /api/usuarios`              |
| Ver un usuario      | `GET /api/usuarios/{id}`         |
| Actualizar usuario  | `PUT /api/usuarios/{id}`         |
| Eliminar usuario    | `DELETE /api/usuarios/{id}`      |

**Ejemplo: actualizar el rol de un usuario**

```
PUT http://localhost:8083/api/usuarios/2
Authorization: Bearer <su_token>
Content-Type: application/json
```

```json
{
  "identificacion": "1234567890",
  "nombre": "Juan Pérez",
  "correo": "juan.perez@usco.edu.co",
  "rol": "ADMINISTRADOR",
  "estado": true
}
```

Para cambiar la contraseña, incluya el campo `password` con la nueva clave. Si lo omite, la contraseña actual se mantiene.

---

## Módulo: Categorías

Las categorías clasifican las convocatorias. Una misma convocatoria puede pertenecer a varias categorías.

### Ejemplos de categorías

- Investigación
- Bienestar
- Académica
- Deportiva
- Cultural

### Operaciones disponibles

| Acción               | Método y ruta                   |
|----------------------|---------------------------------|
| Listar categorías    | `GET /api/categorias`           |
| Ver una categoría    | `GET /api/categorias/{id}`      |
| Crear categoría      | `POST /api/categorias`          |
| Actualizar categoría | `PUT /api/categorias/{id}`      |
| Eliminar categoría   | `DELETE /api/categorias/{id}`   |

**Ejemplo: crear una categoría**

```
POST http://localhost:8083/api/categorias
Authorization: Bearer <su_token>
Content-Type: application/json
```

```json
{
  "nombre": "Académica",
  "descripcion": "Convocatorias de carácter académico y formativo"
}
```

---

## Módulo: Convocatorias

Las convocatorias son el núcleo del sistema. Cada una tiene fechas, cupos y un estado de publicación.

### Estados de una convocatoria

| Estado      | Significado                                              |
|-------------|----------------------------------------------------------|
| BORRADOR    | En preparación. No admite postulaciones.                 |
| PUBLICADA   | Activa y visible. Los estudiantes pueden postularse.     |
| CERRADA     | Finalizada. No admite nuevas postulaciones.              |

### Operaciones disponibles

| Acción                   | Método y ruta                      |
|--------------------------|------------------------------------|
| Listar convocatorias     | `GET /api/convocatorias`           |
| Ver una convocatoria     | `GET /api/convocatorias/{id}`      |
| Crear convocatoria       | `POST /api/convocatorias`          |
| Actualizar convocatoria  | `PUT /api/convocatorias/{id}`      |
| Eliminar convocatoria    | `DELETE /api/convocatorias/{id}`   |

**Ejemplo: crear una convocatoria con categorías**

```
POST http://localhost:8083/api/convocatorias
Authorization: Bearer <su_token>
Content-Type: application/json
```

```json
{
  "nombre": "Monitorías Académicas 2026",
  "descripcion": "Programa de monitorías para apoyo en asignaturas del primer semestre.",
  "fechaInicio": "2026-03-01",
  "fechaFin": "2026-06-30",
  "cuposDisponibles": 15,
  "estado": "PUBLICADA",
  "categoriaIds": [1, 2]
}
```

El campo `categoriaIds` es un arreglo con los identificadores de las categorías asociadas. En el ejemplo anterior, la convocatoria quedaría vinculada a las categorías con ID 1 y 2 (por ejemplo, Académica y Bienestar).

**Ejemplo: publicar una convocatoria en borrador**

```
PUT http://localhost:8083/api/convocatorias/1
Authorization: Bearer <su_token>
Content-Type: application/json
```

Envíe el mismo cuerpo de la convocatoria cambiando `"estado": "PUBLICADA"`.

---

## Módulo: Postulaciones

Los estudiantes se postulan a convocatorias publicadas. Los administradores gestionan el resultado.

### Estados de una postulación

| Estado     | Significado                                |
|------------|--------------------------------------------|
| PENDIENTE  | Recién enviada, en espera de revisión.     |
| APROBADA   | Aceptada por el administrador.               |
| RECHAZADA  | Rechazada por el administrador.              |

### Reglas que debe conocer

- Un estudiante **no puede postularse dos veces** a la misma convocatoria.
- **No se permite postular** a convocatorias en estado `CERRADA`.
- **No se puede superar** el número de `cupos_disponibles` de la convocatoria.
- Al aprobar postulaciones, el sistema verifica nuevamente que haya cupos libres.

### Operaciones disponibles

| Acción                    | Método y ruta                            |
|---------------------------|------------------------------------------|
| Listar postulaciones      | `GET /api/postulaciones`                 |
| Ver una postulación       | `GET /api/postulaciones/{id}`            |
| Crear postulación         | `POST /api/postulaciones`                |
| Aprobar o rechazar        | `PUT /api/postulaciones/{id}/estado`     |

**Ejemplo: un estudiante se postula**

```
POST http://localhost:8083/api/postulaciones
Authorization: Bearer <su_token>
Content-Type: application/json
```

```json
{
  "usuarioId": 3,
  "convocatoriaId": 1
}
```

**Ejemplo: el administrador aprueba una postulación**

```
PUT http://localhost:8083/api/postulaciones/5/estado
Authorization: Bearer <su_token>
Content-Type: application/json
```

```json
{
  "estado": "APROBADA"
}
```

Para rechazar, use `"estado": "RECHAZADA"`.

---

## Módulo: Reportes

El sistema ofrece tres reportes para análisis institucional.

### Reporte 1: Convocatorias por categoría

Muestra cuántas convocatorias hay asociadas a cada categoría.

```
GET http://localhost:8083/api/reportes/convocatorias-categoria
Authorization: Bearer <su_token>
```

**Respuesta de ejemplo**

```json
[
  { "categoria": "Académica", "totalConvocatorias": 4 },
  { "categoria": "Bienestar", "totalConvocatorias": 2 }
]
```

### Reporte 2: Postulaciones por convocatoria

Muestra cuántas postulaciones recibió cada convocatoria.

```
GET http://localhost:8083/api/reportes/postulaciones-convocatoria
Authorization: Bearer <su_token>
```

**Respuesta de ejemplo**

```json
[
  { "convocatoriaId": 1, "totalPostulaciones": 12 },
  { "convocatoriaId": 2, "totalPostulaciones": 7 }
]
```

### Reporte 3: Resultado de postulaciones

Muestra el total de postulaciones en cada estado (PENDIENTE, APROBADA, RECHAZADA).

```
GET http://localhost:8083/api/reportes/resultado-postulaciones
Authorization: Bearer <su_token>
```

**Respuesta de ejemplo**

```json
[
  { "estado": "PENDIENTE", "total": 8 },
  { "estado": "APROBADA", "total": 15 },
  { "estado": "RECHAZADA", "total": 3 }
]
```

---

## Uso de la API con Postman o Insomnia

Si prefiere probar el sistema sin la interfaz web, siga estos pasos:

### 1. Obtener un token

```
POST http://localhost:8083/api/auth/login
Content-Type: application/json
```

```json
{
  "correo": "juan.perez@usco.edu.co",
  "password": "MiClave123"
}
```

Copie el valor de `token` de la respuesta.

### 2. Configurar la autorización

En cada petición subsiguiente, agregue el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

En Postman puede configurarlo en la pestaña **Authorization**, tipo **Bearer Token**, pegando el token obtenido.

### 3. Usar siempre el gateway

Todas las peticiones deben dirigirse a:

```
http://localhost:8083/api/...
```

No llame directamente a los puertos 8080, 8081 o 8082 salvo para pruebas técnicas internas.

### Secuencia recomendada para una prueba completa

1. `POST /api/auth/register` — crear usuario estudiante.
2. `POST /api/auth/login` — obtener token.
3. `POST /api/categorias` — crear al menos dos categorías.
4. `POST /api/convocatorias` — crear convocatoria en estado `PUBLICADA`.
5. `POST /api/postulaciones` — el estudiante se postula.
6. `GET /api/postulaciones` — el administrador revisa las solicitudes.
7. `PUT /api/postulaciones/{id}/estado` — aprobar o rechazar.
8. `GET /api/reportes/...` — consultar los tres reportes.

---

## Mensajes de error frecuentes

| Mensaje / situación                              | Causa probable                              | Qué hacer                                      |
|--------------------------------------------------|---------------------------------------------|------------------------------------------------|
| Credenciales inválidas                           | Correo o contraseña incorrectos             | Verifique los datos e intente de nuevo         |
| 401 Unauthorized                                 | Token ausente, expirado o inválido          | Vuelva a iniciar sesión y renueve el token     |
| El usuario ya se postuló a esta convocatoria     | Postulación duplicada                       | No puede repetir la postulación                |
| No se puede postular a una convocatoria cerrada  | La convocatoria está en estado `CERRADA`    | Elija otra convocatoria activa                   |
| No hay cupos disponibles en la convocatoria      | Se alcanzó el límite de cupos               | Espere cupos o elija otra convocatoria         |
| Convocatoria / Categoría / Usuario no encontrado | El ID no existe en la base de datos         | Verifique el identificador                     |
| Error de conexión al iniciar sesión              | Backend o gateway no están en ejecución     | Verifique que los cuatro servicios estén activos |
| `class file version 61.0` al ejecutar Maven      | `JAVA_HOME` apunta a Java 8                 | Ejecute `. .\scripts\load-env.ps1` o configure Java 21 |
| `autentificación password falló` para postgres   | Falta `.env` o `DB_PASSWORD` incorrecta     | Copie `.env.example` a `.env` y complete la contraseña de Supabase |

---

## Preguntas frecuentes

**¿Puedo registrarme desde la pantalla de login?**
No directamente. El registro se realiza por ahora mediante `POST /api/auth/register`. Tras registrarse, use el formulario de login con su correo y contraseña.

**¿Cuánto dura la sesión?**
El token JWT expira a las 24 horas por defecto. Después de ese tiempo deberá iniciar sesión nuevamente.

**¿Un estudiante puede aprobar postulaciones?**
La aprobación y rechazo están pensados para administradores. El endpoint de cambio de estado valida la autenticación; la restricción por rol en interfaz se aplicará conforme se completen las pantallas del frontend.

**¿Puedo asociar una convocatoria a más de una categoría?**
Sí. Al crear o actualizar una convocatoria, envíe varios IDs en el arreglo `categoriaIds`.

**¿Qué pasa si elimino una categoría que tiene convocatorias asociadas?**
La relación en la tabla intermedia se elimina en cascada. Las convocatorias permanecen, pero pierden esa categoría asociada.

**¿Dónde configuro la base de datos?**
En las variables de entorno `DB_URL`, `DB_USER` y `DB_PASSWORD`. Consulte `.env.example` y `README.md` para más detalle.

**¿La aplicación funciona sin internet?**
En desarrollo local necesita conexión a Supabase (base de datos en la nube). Los servicios backend y el frontend corren en su equipo.

---

## Soporte

Para problemas de instalación, configuración o despliegue, revise:

- `README.md` — documentación técnica del proyecto.
- `docs/despliegue-render.md` — guía de despliegue en Render.
- `docs/database/` — scripts SQL y diagrama entidad-relación.
