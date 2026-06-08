# Documentación Técnica — HospitalDB

**Universidad:** UPANA  
**Curso:** Base de Datos II  
**Ciclo:** 7  
**Fecha:** Junio 2026  

---

## Equipo de Desarrollo

| Nombre   | Rol | ID |
|----------|-----|----|
| Valentín | Front-End Developer / Analista | 000143158 |
| Cristian | Analista de Datos / Base de Datos | 000140397 |
| Walter   | Backend Developer / Analista | 000140195 |

---

## 1. Descripción General del Proyecto

HospitalDB es un sistema de gestión hospitalaria diseñado para administrar de forma integral los procesos clínicos, administrativos y de inventario de un hospital.

El sistema permite gestionar pacientes, médicos, citas médicas, tratamientos, medicamentos, bodegas de inventario, ingresos y egresos hospitalarios, control de acceso basado en roles y auditoría completa de todas las operaciones del sistema.

El proyecto fue desarrollado como aplicación práctica de los conocimientos adquiridos en el curso, integrando conceptos de seguridad, arquitectura de software, bases de datos relacionales y no relacionales, procesos ETL y análisis de datos.

Se incorporan prácticas como encriptación de credenciales, uso de variables de entorno para configuración sensible, transacciones ACID, control de acceso basado en roles y separación de responsabilidades por capas.

---

## 2. Objetivos del Sistema

- Centralizar la gestión hospitalaria en una plataforma única e integrada.
- Implementar un sistema de seguridad robusto basado en autenticación federada y control de acceso por roles.
- Garantizar la integridad de los datos mediante transacciones ACID en operaciones críticas.
- Mantener trazabilidad completa de todas las operaciones mediante auditoría centralizada.
- Facilitar la toma de decisiones mediante procesos ETL y análisis en herramientas de Business Intelligence.
- Aplicar principios de arquitectura limpia y buenas prácticas de ingeniería de software.

---

## 3. Arquitectura del Sistema

HospitalDB se basa en una arquitectura de tres capas con separación estricta de responsabilidades.

### 3.1 Diagrama de Arquitectura

```
                    ┌────────────────────────────┐
                    │        FRONTEND            │
                    │   React + Vite (5173)      │
                    └─────────────┬──────────────┘
                                  │ HTTP / REST
                                  ▼
                    ┌────────────────────────────┐
                    │         BACKEND            │
                    │ Spring Boot 4 + Java 26    │
                    │        (8081)              │
                    │                            │
                    │ Controllers                │
                    │ Services                   │
                    │ Repositories               │
                    │ Security (Keycloak)        │
                    └───────┬─────────┬──────────┘
                            │         │
          ┌─────────────────┘         └─────────────────┐
          ▼                                           ▼
 ┌───────────────────────┐               ┌────────────────────────┐
 │       MySQL 8         │               │      MongoDB 7         │
 │ 5 esquemas ACID       │               │   Auditoría logs       │
 └──────────┬────────────┘               └──────────┬─────────────┘
            │                                      │
            ▼                                      ▼
     ┌────────────────────────────────────────────────────┐
     │            ETL (Python) + Power BI                │
     │   Extracción → Transformación → Carga             │
     │   Dashboards y análisis                           │
     └────────────────────────────────────────────────────┘
```

---

### Backend (capas internas)

- Controllers: exposición de endpoints REST  
- Services: lógica de negocio  
- Repositories: acceso a datos (JPA)  
- Security Layer: Spring Security + Keycloak 26  

---

### 3.2 Esquemas de base de datos MySQL

| Esquema | Descripción |
|----------|------------|
| administrativo_db | Usuarios, roles y permisos |
| clinico_db | Pacientes, médicos, citas, diagnósticos |
| medicamento_db | Catálogo de medicamentos |
| inventario_db | Stock, bodegas y movimientos |
| hospitalario_db | Hospitalizaciones y áreas |

---

## 4. Stack Tecnológico

### 4.1 Backend

- Java 26
- Spring Boot 4.0.6
- Spring Data JPA + Hibernate 7.2
- Spring Security
- Keycloak 26
- OAuth2 Resource Server
- Jasypt
- WebFlux / WebClient
- Lombok
- ModelMapper

---

### 4.2 Base de datos

- MySQL 8 (transaccional)
- MongoDB 7 (auditoría)

---

### 4.3 Frontend

- React 19 + Vite
- TypeScript
- React Router DOM
- React Query
- Zustand
- TailwindCSS
- FullCalendar
- React Big Calendar
- Date-fns
- FontAwesome

---

## 5. Arquitectura del Frontend

Arquitectura modular por dominio:

- application: casos de uso  
- domain: entidades y DTOs  
- infrastructure: APIs y repositorios  
- hooks: React Query logic  
- ui: vistas y componentes  
- types: tipado  

Estado:
- React Query → server state  
- Zustand → estado global mínimo  

---

## 6. Estructura del Proyecto

```
frontend/
└── src/
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
    │   │       ├── pages/
    │   │       └── utils/
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
    │   │   ├── services/
    │   │   ├── store/
    │   │   └── ui/
    │   │       ├── components/
    │   │       ├── pages/
    │   │       └── utils/
    │   │
    │   ├── hospital/
    │   │   ├── application/
    │   │   │   ├── interfaces/
    │   │   ├── domain/
    │   │   │   ├── dto/
    │   │   │   └── entities/
    │   │   ├── hooks/
    │   │   │   ├── doctor/
    │   │   │   ├── hospitalArea/
    │   │   │   └── hospitalitation/
    │   │   ├── infrastructure/
    │   │   │   ├── mappers/
    │   │   │   └── repositories/
    │   │   ├── types/
    │   │   └── ui/
    │   │       ├── components/
    │   │       ├── pages/
    │   │       └── utils/
    │   │
    │   ├── inventory/
    │   │   ├── application/
    │   │   │   └── interfaces/
    │   │   ├── domain/
    │   │   │   ├── dto/
    │   │   │   └── entities/
    │   │   ├── hooks/
    │   │   │   ├── medicine/
    │   │   │   └── store/
    │   │   ├── infrastructure/
    │   │   │   ├── mappers/
    │   │   │   └── repositories/
    │   │   ├── types/
    │   │   └── ui/
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
```
---

## 7. Seguridad del Sistema

### Flujo de autenticación

1. Login en frontend  
2. Keycloak valida credenciales  
3. Emisión de JWT  
4. Frontend envía token  
5. Spring Security valida  
6. Aplicación de roles  

---

### Capas de seguridad

- Keycloak (IAM)
- Spring Security
- JWT stateless
- Jasypt (secrets)
- HTTPS

---

## 8. ETL y Business Intelligence

- Extract: MySQL  
- Transform: Python  
- Load: modelo analítico  
- Visualización: Power BI  

### 8.1 Dashboard Analítico

Como parte de la fase de análisis e inteligencia de negocios, se desarrolló un conjunto de dashboards utilizando Power BI para visualizar indicadores relevantes del sistema hospitalario.

Los tableros permiten analizar información relacionada con:

- Pacientes registrados
- Citas médicas
- Hospitalizaciones
- Consumo de medicamentos
- Movimientos de inventario
- Tendencias operativas y administrativas

La solución fue implementada y validada utilizando Power BI Desktop, permitiendo demostrar la aplicación de procesos ETL y análisis de datos sobre la información almacenada en el sistema.

#### Justificación de no integración directa

Aunque el dashboard fue desarrollado satisfactoriamente, no se integró directamente dentro de la aplicación web HospitalDB debido a restricciones asociadas al licenciamiento de Power BI.

La integración embebida de reportes dentro de aplicaciones web requiere servicios adicionales de Power BI Service y, dependiendo del escenario de publicación, licencias específicas para usuarios finales o capacidades dedicadas de Power BI Embedded.

Debido a que el alcance del proyecto corresponde a un entorno académico y no empresarial, se optó por mantener la solución analítica desacoplada de la aplicación principal, presentando los dashboards de forma independiente mediante Power BI Desktop.

Esta decisión permitió:

- Cumplir con los objetivos académicos relacionados con ETL y Business Intelligence.
- Evitar costos asociados a licenciamiento y publicación en la nube.
- Mantener una arquitectura desacoplada entre el sistema transaccional y la capa analítica.
- Facilitar la demostración de los indicadores sin requerir infraestructura adicional.
- Reducir la complejidad de despliegue del proyecto.

La arquitectura fue diseñada para que, en un escenario futuro, los dashboards puedan integrarse mediante Power BI Embedded o cualquier otra plataforma de Business Intelligence sin necesidad de modificar la lógica de negocio del sistema.

---

## 9. Variables de Entorno

- JASYPT_ENCRYPTOR_PASSWORD  
- KEYCLOAK_ADMIN_USER  
- KEYCLOAK_ADMIN_PASSWORD  
- KEYCLOAK_CLIENT_SECRET  
- MONGO_ROOT_USER  
- MONGO_ROOT_PASSWORD  
- SPRING_PROFILES_ACTIVE  

---

## 10. Despliegue

### Requisitos
- Docker
- Docker Compose
- .env configurado

### Pasos

git clone <https://github.com/ssvalen/sistema-hospital>
cd hospitaldb
cp .env.example .env
docker compose up -d
docker compose ps

---

### Servicios

| Servicio | URL |
|----------|-----|
| Backend | http://localhost:8081 |
| Frontend | http://localhost:5173 |
| Keycloak | http://localhost:8080 |
| MySQL | http://localhost:3307 |
| MongoDB | http://localhost:27017 |

---

## 11. Acceso al Sistema

- Usuario: superadmin  
- Contraseña: admin123  

---

## 12. Decisiones de Diseño

- MySQL dividido en esquemas para modularidad lógica  
- MongoDB exclusivo para auditoría  
- Backend en capas para mantenibilidad  
- Frontend modular por dominio  
- Keycloak centraliza autenticación  
- JWT para arquitectura stateless  
- ETL desacopla analítica del sistema operativo  
- Power BI evita carga en backend  
- React Query reduce complejidad de estado servidor  
- Zustand solo para estado global mínimo  
- Docker Compose garantiza reproducibilidad  
- Seguridad en capas (defense in depth)  
- Separación estricta frontend/backend  
- Escalabilidad por módulos independientes  

---

## 13. Licencia

Proyecto académico — UPANA  

---

## 14. Versión

v1.0.0 — Junio 2026