# Documentación Técnica — HospitalDB

**Universidad:** UPANA  
**Curso:** Base de Datos II  
**Ciclo:** 7  
**Fecha:** Junio 2026  

---

## Equipo de Desarrollo

| Nombre   | Rol |
|----------|-----|
| Valentín | Front-End Developer / Analista |
| Cristian | Analista de Datos / Base de Datos |
| Walter   | Backend Developer / Analista |

---

## 1. Descripción General del Proyecto

HospitalDB es un sistema de gestión hospitalaria diseñado para administrar los procesos clínicos, administrativos e inventario de un hospital. El sistema permite gestionar pacientes, médicos, citas, tratamientos, medicamentos, inventario, ingresos y egresos hospitalarios, control de acceso basado en roles y auditoría completa de todas las operaciones.

El proyecto fue desarrollado como implementación práctica de los conocimientos adquiridos en clase, incluyendo encriptación de datos sensibles, gestión de strings de conexión seguros, procesos ETL, análisis de datos y cumplimiento de propiedades ACID en transacciones.

---

## 2. Objetivos del Sistema

- Centralizar la gestión de información hospitalaria en una plataforma unificada.
- Implementar seguridad robusta mediante encriptación y autenticación federada.
- Garantizar la integridad de los datos mediante transacciones ACID.
- Proveer auditoría completa de todas las operaciones del sistema.
- Facilitar el análisis de datos mediante procesos ETL y tableros de Business Intelligence.
- Aplicar buenas prácticas de desarrollo de software en un entorno real.

---

## 3. Arquitectura del Sistema

HospitalDB sigue una arquitectura de tres capas con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONT END                            │
│              React + Node.js (Puerto 3000)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
┌─────────────────────▼───────────────────────────────────────┐
│                        BACK END                             │
│           Spring Boot 4 + Java 26 (Puerto 8081)            │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐   │
│  │ Controllers │  │  Services   │  │   Repositories     │   │
│  └─────────────┘  └─────────────┘  └────────────────────┘   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        Spring Security + Keycloak 26                 │  │
│  └───────────────────────────────────────────────────────┘  │
└──────┬──────────────────────┬──────────────────────────────┘
       │                      │
┌──────▼──────┐    ┌──────────▼──────────┐
│   MySQL 8   │    │     MongoDB 7.0     │
│ (5 esquemas)│    │   (Audit Logs)      │
└─────────────┘    └─────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│         ETL + Power BI                  │
│   Python (Extracción y transformación)  │
│   Power BI (Tableros y análisis)        │
└─────────────────────────────────────────┘
```

---

### 3.1 Esquemas de Base de Datos MySQL

| Esquema              | Descripción |
|----------------------|-------------|
| `administrativo_db`  | Usuarios del sistema, roles, permisos |
| `clinico_db`         | Pacientes, médicos, citas, tratamientos |
| `medicamento_db`     | Catálogo de medicamentos |
| `inventario_db`      | Bodegas e inventario de medicamentos |
| `hospitalario_db`    | Áreas hospitalarias, ingresos y egresos |

---

## 4. Stack Tecnológico

### 4.1 Back End

#### Java 26
Java 26 fue seleccionado por ser la versión más reciente de la plataforma.

#### Spring Boot 4.0.6
Framework para APIs REST en Java.

#### Hibernate 7.2 + Spring Data JPA
ORM para acceso a datos relacionales.

#### Keycloak 26
Sistema IAM basado en OAuth2 y OpenID Connect.

#### Spring Security + OAuth2 Resource Server
Validación de JWT y control de acceso.

#### Jasypt
Encriptación de credenciales en configuración.

#### WebFlux / WebClient
Cliente HTTP reactivo.

#### Lombok
Reduce código boilerplate.

#### ModelMapper
Mapeo entre entidades y DTOs.

---

### 4.2 Base de Datos Relacional

#### MySQL 8
Motor principal con soporte ACID.

#### Múltiples esquemas
Separación de dominios.

---

### 4.3 Base de Datos No Relacional

#### MongoDB 7.0
Usado para auditoría de logs.

---

### 4.4 Contenerización

#### Docker + Docker Compose
Orquestación de servicios.

---

### 4.5 Front End

#### React + Vite

El frontend fue desarrollado utilizando **React 19** con **Vite** como herramienta de build y entorno de desarrollo.

---

#### Arquitectura Frontend

Se adoptó una arquitectura basada en:

- Feature-Based Architecture
- Clean Architecture adaptada a frontend
- Uso de React Query para estado servidor

---

#### Stack Frontend

- React 19
- Vite
- TypeScript
- React Router DOM
- TanStack React Query
- Zustand
- TailwindCSS
- FullCalendar
- React Big Calendar
- Date-fns
- FontAwesome

---

#### Estructura del frontend
```
src/
├── app/
│   ├── providers/
│   └── routes/
├── assets/
├── layouts/
├── modules/
│   ├── admin/
│   │   ├── application/
│   │   │   ├── interfaces/
│   │   │   └── useCases/
│   │   ├── domain/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── hooks/
│   │   │   ├── etl/
│   │   │   ├── permissions/
│   │   │   ├── roles/
│   │   │   └── user/
│   │   ├── infrastructure/
│   │   │   ├── mappers/
│   │   │   └── repositories/
│   │   ├── types/
│   │   └── ui/
│   │       ├── pages/
│   │       └── utils/
│   │
│   ├── appointments/
│   │   ├── application/
│   │   │   ├── interfaces/
│   │   │   └── useCase/
│   │   ├── domain/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── hooks/
│   │   │   ├── appointments/
│   │   │   ├── medication/
│   │   │   └── treatment/
│   │   ├── infrastructure/
│   │   │   ├── mappers/
│   │   │   └── repositories/
│   │   ├── store/
│   │   ├── types/
│   │   └── ui/
│   │       ├── pages/
│   │       └── utils/
│   │
│   ├── audit/
│   │   ├── application/
│   │   │   └── interfaces/
│   │   ├── domain/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── hooks/
│   │   ├── infrastructure/
│   │   │   ├── mappers/
│   │   │   └── repositories/
│   │   ├── types/
│   │   └── ui/
│   │       └── pages/
│   │
│   ├── auth/
│   │   ├── application/
│   │   │   ├── interfaces/
│   │   │   └── useCases/
│   │   ├── domain/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── hooks/
│   │   ├── infrastructure/
│   │   │   ├── mappers/
│   │   │   └── repositories/
│   │   ├── store/
│   │   └── ui/
│   │       ├── components/
│   │       ├── pages/
│   │       └── utils/
│   │
│   ├── hospital/
│   │   ├── application/
│   │   │   └── interfaces/
│   │   ├── domain/
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── hooks/
│   │   │   ├── doctor/
│   │   │   ├── hospitalArea/
│   │   │   └── hospitalization/
│   │   ├── infrastructure/
│   │   │   ├── mappers/
│   │   │   └── repositories/
│   │   ├── types/
│   │   └── ui/
│   │       ├── components/
│   │       ├── pages/
│   │       └── utils/
│   │
│   └── patients/
│       ├── application/
│       │   ├── interfaces/
│       │   └── useCases/
│       ├── domain/
│       │   ├── dto/
│       │   └── entities/
│       ├── hooks/
│       ├── infrastructure/
│       │   ├── mappers/
│       │   └── repositories/
│       ├── types/
│       └── ui/
│           ├── pages/
│           └── utils/
│
├── routes/
└── shared/
    ├── components/
    │   ├── forms/
    │   ├── layout/
    │   └── permissions/
    ├── errors/
    ├── hooks/
    ├── http/
    ├── infrastructure/
    │   └── mappers/
    ├── pages/
    ├── types/
    │   ├── button/
    │   ├── pagination/
    │   ├── table/
    │   └── toast/
    └── utils/
```
---

#### Principios de arquitectura

Cada módulo incluye:

- application/ (use cases)
- domain/ (entities + dto)
- infrastructure/ (repositories + mappers)
- hooks/ (React Query logic)
- ui/ (pages + components)
- types/

---

#### Estado y datos

- React Query para estado servidor
- Zustand para estado global mínimo
- Axios/fetch encapsulado en infraestructura

---

### 4.6 ETL e Inteligencia de Negocios

#### Python (ETL)
Procesos de extracción, transformación y carga.

#### Power BI
Dashboards y análisis.

---

## 5. Implementación de Conceptos Académicos

### 5.1 Encriptación
Jasypt con `PBEWithMD5AndDES`.

### 5.2 Strings de conexión seguros
Variables de entorno `.env`.

### 5.3 Transacciones ACID
Uso de `@Transactional`.

### 5.4 Auditoría
MongoDB para logs.

### 5.5 ETL
Python para procesamiento de datos.

### 5.6 Control de acceso
Roles dinámicos con Keycloak.

---

## 6. Estructura del Proyecto

```
backend/
├── src/main/java/com/hospitaldb/backend/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── enums/
│   ├── exception/
│   ├── repository/
│   ├── service/
│   └── BackendApplication.java
├── resources/
├── Dockerfile
└── pom.xml

frontend/
├── src/
│   ├── app/
│   ├── assets/
│   ├── layouts/
│   ├── modules/
│   ├── routes/
│   └── shared/
├── package.json
└── vite.config.ts

etl/
├── scripts/
│   ├── extract_mysql.py
│   ├── transform.py
│   └── load.py
└── requirements.txt

docker-compose.yml
.env.example
```

---

## 7. Seguridad

### Flujo de autenticación

1. Login en frontend  
2. Keycloak valida credenciales  
3. Retorna JWT  
4. Uso en requests  
5. Spring valida token  
6. Control de roles  

---

### Capas de seguridad

| Capa | Tecnología |
|------|-----------|
| Autenticación | Keycloak |
| Autorización | Spring Security |
| Roles | MySQL |
| Encriptación | Jasypt |
| Transporte | HTTPS |

---

## 8. Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `JASYPT_ENCRYPTOR_PASSWORD` | Clave de cifrado |
| `KEYCLOAK_ADMIN_USER` | Admin Keycloak |
| `KEYCLOAK_ADMIN_PASSWORD` | Admin password |
| `KEYCLOAK_CLIENT_SECRET` | OAuth secret |
| `MONGO_ROOT_USER` | MongoDB user |
| `MONGO_ROOT_PASSWORD` | MongoDB password |
| `SPRING_PROFILES_ACTIVE` | Perfil activo |

---

## 9. Despliegue

### Requisitos
- Docker
- .env configurado

### Comandos

```bash
git clone <repo>
cp .env.example .env
docker compose up -d
docker compose ps
```

---

### Servicios

| Servicio | URL |
|----------|-----|
| Backend | http://localhost:8081 |
| Frontend | http://localhost:3000 |
| Keycloak | http://localhost:8080 |
| MongoDB | localhost:27017 |
| MySQL | localhost:3307 |

---

## 10. Decisiones de Diseño

- Múltiples esquemas en MySQL.
- MongoDB solo para auditoría.
- Roles dinámicos.
- Sincronización MySQL + Keycloak.

---

*Documentación generada en Junio 2026 — HospitalDB v1.0*
```