<<<<<<< HEAD
# Pokemon SOA API - Infraestructura Docker

## 📋 Descripción

Sistema de microservicios completo con API Gateway, microservicio de Pokemon con lógica de negocio y base de datos PostgreSQL, todo desplegado con Docker.

## 🏗️ Arquitectura

```
┌─────────────────┐
│   API Gateway   │ (Puerto 3001)
│  (Express.js)   │
└────────┬────────┘
         │
         │ Proxy/Routing
         ▼
┌─────────────────┐     ┌──────────────┐
│ Pokemon Service │────►│  PostgreSQL  │
│  (Express.js)   │     │  (Puerto 5432)│
│  (Puerto 3002)  │     └──────────────┘
└─────────────────┘
```

## 📦 Componentes

### 1. **Docker Compose** (`docker-compose.yml`)
- Orquestación de todos los servicios
- Redes virtuales Docker (`pokemon-network`)
- Volúmenes persistentes para PostgreSQL
- Health checks para dependencias

### 2. **Base de Datos PostgreSQL**
- Imagen: `postgres:15-alpine`
- Puerto: `5432`
- Volumen persistente: `pokemon_postgres_data`
- Scripts SQL de inicialización automática

### 3. **API Gateway** (Puerto 3001)
- Enrutamiento y proxy de peticiones
- Middleware CORS
- Manejo centralizado de errores
- Dockerfile optimizado

### 4. **Pokemon Microservice** (Puerto 3002)
- CRUD completo de Pokemon
- Lógica de negocio compleja:
  - Gestión de tipos, estadísticas y habilidades
  - Transacciones de base de datos
  - Validaciones y reglas de negocio
  - Paginación y filtros
- Conexión a PostgreSQL con pool de conexiones
- Health check endpoint

## 🗄️ Base de Datos

### Tablas Principales

1. **pokemons** - Datos básicos de Pokemon
2. **pokemon_types** - Tipos de Pokemon (fire, water, etc.)
3. **pokemon_stats** - Estadísticas (HP, Attack, Defense, etc.)
4. **abilities** - Habilidades de Pokemon
5. **pokemon_type_relations** - Relación muchos a muchos
6. **pokemon_abilities** - Relación muchos a muchos con habilidades

### Datos Iniciales

El script `scripts/init.sql` incluye:
- 18 tipos de Pokemon
- 5 Pokemon de ejemplo (Pikachu, Charizard, Bulbasaur, Squirtle, Mewtwo)
- Estadísticas completas
- Habilidades y relaciones
- Índices para optimización

## 🚀 Instalación y Uso

### Prerrequisitos

- Docker Desktop instalado
- Docker Compose instalado
- 2GB de RAM disponible

### Paso 1: Clonar y configurar

```powershell
# Navegar al directorio del proyecto
cd "c:\Mis archivos\UNIVERSIDAD\rick-soa-api"

# Crear archivos .env (opcional, ya tiene valores por defecto)
Copy-Item .env.example .env
```

### Paso 2: Construir y levantar servicios

```powershell
# Construir las imágenes y levantar todos los servicios
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

### Paso 3: Verificar que todo esté funcionando

```powershell
# Ver logs de todos los servicios
docker-compose logs -f

# Ver estado de los contenedores
docker-compose ps

# Verificar health checks
docker inspect pokemon-service --format='{{.State.Health.Status}}'
```

## 🧪 Probar la API

### Health Check

```powershell
# Microservicio
curl http://localhost:3002/health

# Respuesta esperada:
# {"status":"UP","service":"pokemon-service","timestamp":"..."}
```

### Endpoints del Microservicio (a través del Gateway)

```powershell
# Obtener todos los Pokemon (paginado)
curl http://localhost:3001/api/v1/pokemon?page=1&limit=10

# Obtener Pokemon por ID
curl http://localhost:3001/api/v1/pokemon/1

# Obtener Pokemon por nombre
curl http://localhost:3001/api/v1/pokemon/name/pikachu

# Obtener Pokemon por tipo
curl http://localhost:3001/api/v1/pokemon/type/electric

# Obtener estadísticas promedio
curl http://localhost:3001/api/v1/pokemon/stats/average

# Crear nuevo Pokemon
curl -X POST http://localhost:3001/api/v1/pokemon `
  -H "Content-Type: application/json" `
  -d '{
    "name": "garchomp",
    "height": 19,
    "weight": 950,
    "base_experience": 300,
    "sprite_url": "https://example.com/garchomp.png",
    "types": ["dragon", "ground"],
    "stats": {
      "hp": 108,
      "attack": 130,
      "defense": 95,
      "special_attack": 80,
      "special_defense": 85,
      "speed": 102
    },
    "abilities": [
      {"name": "sand-veil", "is_hidden": false},
      {"name": "rough-skin", "is_hidden": true}
    ]
  }'

# Actualizar Pokemon
curl -X PUT http://localhost:3001/api/v1/pokemon/1 `
  -H "Content-Type: application/json" `
  -d '{"base_experience": 120}'

# Eliminar Pokemon
curl -X DELETE http://localhost:3001/api/v1/pokemon/6
```

## 📊 Gestión de Contenedores

```powershell
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (BORRA LA BASE DE DATOS)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart pokemon-service

# Ver logs de un servicio específico
docker-compose logs -f postgres

# Ejecutar comando en un contenedor
docker-compose exec postgres psql -U pokemon_user -d pokemon_db

# Reconstruir solo un servicio
docker-compose up -d --build pokemon-service
```

## 🗃️ Acceso Directo a PostgreSQL

```powershell
# Conectarse a PostgreSQL desde línea de comandos
docker-compose exec postgres psql -U pokemon_user -d pokemon_db

# Consultas útiles
SELECT * FROM pokemons;
SELECT COUNT(*) FROM pokemons;
SELECT p.name, pt.name as type 
FROM pokemons p
JOIN pokemon_type_relations ptr ON p.id = ptr.pokemon_id
JOIN pokemon_types pt ON ptr.type_id = pt.id;
```

## 🔧 Lógica de Negocio Implementada

### Características del Microservicio

1. **CRUD Completo**
   - Create: Creación con transacciones
   - Read: Consultas optimizadas con joins
   - Update: Actualización parcial
   - Delete: Eliminación con cascada

2. **Operaciones Complejas**
   - Paginación de resultados
   - Filtrado por tipos
   - Búsqueda por nombre (case-insensitive)
   - Cálculo de estadísticas agregadas

3. **Integridad de Datos**
   - Transacciones ACID
   - Validaciones de entrada
   - Constraints de base de datos
   - Manejo de errores robusto

4. **Optimizaciones**
   - Pool de conexiones
   - Índices de base de datos
   - Lazy loading de relaciones
   - Health checks

## 🌐 Redes Docker

El proyecto usa una red bridge personalizada (`pokemon-network`) que permite:
- Comunicación entre contenedores por nombre
- Aislamiento de la red externa
- DNS automático de Docker

## 📦 Volúmenes Persistentes

- `pokemon_postgres_data`: Persiste los datos de la base de datos entre reinicios

## ⚙️ Variables de Entorno

### Gateway
- `PORT`: Puerto del gateway (default: 3001)
- `MICROSERVICE_URL`: URL del microservicio
- `FRONTEND_URL`: URL del frontend (CORS)

### Microservicio
- `PORT`: Puerto del servicio (default: 3002)
- `DATABASE_URL`: Conexión a PostgreSQL
- `NODE_ENV`: Ambiente (development/production)

### PostgreSQL
- `POSTGRES_USER`: Usuario de la base de datos
- `POSTGRES_PASSWORD`: Contraseña
- `POSTGRES_DB`: Nombre de la base de datos

## 🎯 Cumplimiento de Requisitos

✅ **Docker**: Dockerfiles para cada servicio  
✅ **Docker Compose**: Orquestación completa  
✅ **PostgreSQL**: Base de datos relacional  
✅ **Scripts SQL**: Inicialización automática de tablas  
✅ **Redes Docker**: Red bridge personalizada  
✅ **Código de aplicación**: Gateway y microservicio  
✅ **Lógica de negocio**: CRUD completo con operaciones complejas  

## 🐛 Troubleshooting

### Puerto en uso
```powershell
# Cambiar puertos en docker-compose.yml o usar otros puertos
$env:GATEWAY_PORT=3011
$env:SERVICE_PORT=3012
docker-compose up
```

### Base de datos no inicializa
```powershell
# Eliminar volúmenes y recrear
docker-compose down -v
docker-compose up --build
```

### Healthcheck falla
```powershell
# Ver logs del servicio
docker-compose logs pokemon-service
```

## 📝 Licencia

Proyecto académico - Universidad

## 👥 Autor

Estudiante de Arquitecturas SOA
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 9b2a31dd6630ddb68d224f99711819b014f425bb
