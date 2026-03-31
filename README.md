#  Rick and Morty - Arquitectura Orientada a Servicios (SOA)

Este repositorio contiene la implementación completa de un sistema basado en una **Arquitectura Orientada a Servicios (SOA)**. El proyecto está diseñado para consumir, gestionar y servir datos de la API de *Rick and Morty*, dividiendo las responsabilidades en componentes independientes y escalables.

##  Arquitectura del Sistema

El proyecto está compuesto por tres pilares fundamentales que se comunican entre sí:

1. **API Gateway (`/poke-soa-gateaway`):** Desarrollado con Next.js y TypeScript, actúa como el único punto de entrada para los clientes (frontend). Se encarga de recibir las peticiones, manejar el CORS, interceptar errores y redirigir (proxy) el tráfico hacia los microservicios correspondientes.
2. **Microservicio Core (`/RickandMorty-service`):** Un servicio backend independiente construido en Node.js y TypeScript. Contiene la lógica de negocio, los modelos de datos y los controladores específicos para gestionar la información de los personajes.
3. **Base de Datos (Dockerizada):** Una base de datos relacional desplegada a través de contenedores. El repositorio incluye scripts SQL (`/scripts/init.sql`, `/scripts/add-more-rickandmorty.sql`) para la inicialización automática de las tablas y la carga de datos semilla (seed).

##  Tecnologías y Herramientas

* **Gateway:** Next.js (API Routes), TypeScript, Middleware personalizado.
* **Microservicio:** Node.js, TypeScript.
* **Base de Datos:** SQL (Inicializada vía scripts).
* **Orquestación y Despliegue:** Docker y Docker Compose.

##  Estructura del Repositorio

```text
├── poke-soa-gateaway/       # Puerta de enlace (API Gateway)
├── RickandMorty-service/    # Microservicio principal de lógica y datos
├── scripts/                 # Scripts SQL para inicializar la base de datos
├── docker-compose.yml       # Archivo de orquestación de contenedores Docker
└── README.md                # Documentación del proyecto
