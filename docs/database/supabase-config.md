# Configuración Supabase

Use el **pooler Supavisor** (IPv4) para desarrollo local y despliegue. La conexión directa (`db.*.supabase.co:5432`) solo resuelve por IPv6 y puede fallar en redes sin soporte IPv6.

| Parámetro | Valor |
|-----------|-------|
| Host (pooler) | `aws-1-us-east-2.pooler.supabase.com` |
| Puerto | `6543` (modo transacción) |
| Base de datos | `postgres` |
| Usuario | `postgres.aegfjfdnpqxtqvnqvyok` |

## Cadena de conexión

```
postgresql://postgres.aegfjfdnpqxtqvnqvyok:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres
```

## Variables para desarrollo local (archivo `.env`)

```
DB_URL=jdbc:postgresql://aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
DB_USER=postgres.aegfjfdnpqxtqvnqvyok
DB_PASSWORD=[YOUR-PASSWORD]
```

`prepareThreshold=0` es necesario en el puerto 6543 (modo transacción del pooler).

Cargar en PowerShell antes de iniciar los microservicios:

```powershell
. .\scripts\load-env.ps1
```
