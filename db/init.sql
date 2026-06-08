-- ==========================================================
-- LIMPIEZA COMPLETA
-- ==========================================================

DROP DATABASE IF EXISTS inventario_db;
DROP DATABASE IF EXISTS medicamento_db;
DROP DATABASE IF EXISTS clinico_db;
DROP DATABASE IF EXISTS administrativo_db;
DROP DATABASE IF EXISTS keycloak_db;
DROP DATABASE IF EXISTS hospitalario_db;

DROP USER IF EXISTS 'hospital_api_user'@'%';


-- ==========================================================
-- CREACIÓN DE ESQUEMAS
-- ==========================================================

CREATE DATABASE IF NOT EXISTS administrativo_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS clinico_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS medicamento_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS inventario_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS keycloak_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS hospitalario_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- ==========================================================
-- USUARIO DE APLICACIÓN
-- ==========================================================

CREATE USER IF NOT EXISTS 'hospital_api_user'@'%'
IDENTIFIED BY 'Hospital@API2026!';

GRANT ALL PRIVILEGES ON administrativo_db.* TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON clinico_db.* TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON medicamento_db.* TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON inventario_db.* TO 'hospital_api_user'@'%';
GRANT SELECT ON keycloak_db.* TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON hospitalario_db.* TO 'hospital_api_user'@'%';

FLUSH PRIVILEGES;


-- ==========================================================
-- VERIFICAR USUARIO
-- ==========================================================

SELECT user, host
FROM mysql.user
WHERE user = 'hospital_api_user';


-- ==========================================================
-- ESQUEMA ADMINISTRATIVO
-- ==========================================================

CREATE TABLE IF NOT EXISTS administrativo_db.usuario_sistema (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    activo BIT NOT NULL,
    email VARCHAR(150) NOT NULL,
    id_keycloak VARCHAR(100),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY UK_email (email),
    UNIQUE KEY UK_username (username)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS administrativo_db.rol_padre (
    id_rol_padre BIGINT NOT NULL AUTO_INCREMENT,
    nombre_rol_padre VARCHAR(50) NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_rol_padre),
    UNIQUE KEY UK_nombre_rol_padre (nombre_rol_padre)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS administrativo_db.rol (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL,
    id_rol_padre BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_rol),
    CONSTRAINT FK_rol_rol_padre
        FOREIGN KEY (id_rol_padre)
        REFERENCES administrativo_db.rol_padre(id_rol_padre),
    UNIQUE KEY UK_nombre_rol (nombre_rol)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS administrativo_db.permiso (
    id_permiso BIGINT NOT NULL AUTO_INCREMENT,
    nombre_permiso VARCHAR(100) NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_permiso),
    UNIQUE KEY UK_nombre_permiso (nombre_permiso)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS administrativo_db.usuario_rol (
    id BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT FK_usuario_rol_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES administrativo_db.usuario_sistema(id_usuario),
    CONSTRAINT FK_usuario_rol_rol
        FOREIGN KEY (id_rol)
        REFERENCES administrativo_db.rol(id_rol)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS administrativo_db.rol_permiso (
    id BIGINT NOT NULL AUTO_INCREMENT,
    id_rol BIGINT NOT NULL,
    id_permiso BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT FK_rol_permiso_rol
        FOREIGN KEY (id_rol)
        REFERENCES administrativo_db.rol(id_rol),
    CONSTRAINT FK_rol_permiso_permiso
        FOREIGN KEY (id_permiso)
        REFERENCES administrativo_db.permiso(id_permiso)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA CLÍNICO
-- ==========================================================

CREATE TABLE IF NOT EXISTS clinico_db.paciente (
    id_paciente BIGINT NOT NULL AUTO_INCREMENT,
    apellido VARCHAR(100) NOT NULL,
    direccion TEXT,
    fecha_nacimiento DATE,
    genero VARCHAR(1),
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_paciente)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS clinico_db.medico (
    id_medico BIGINT NOT NULL AUTO_INCREMENT,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    especialidad VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_medico)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS clinico_db.cita (
    id_cita BIGINT NOT NULL AUTO_INCREMENT,
    estado VARCHAR(50),
    fecha_hora DATETIME(6) NOT NULL,
    id_medico BIGINT NOT NULL,
    id_paciente BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_cita),
    CONSTRAINT FK_cita_medico
        FOREIGN KEY (id_medico)
        REFERENCES clinico_db.medico(id_medico),
    CONSTRAINT FK_cita_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES clinico_db.paciente(id_paciente)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS clinico_db.tratamiento (
    id_tratamiento BIGINT NOT NULL AUTO_INCREMENT,
    descripcion TEXT,
    fecha_fin DATE,
    fecha_inicio DATE,
    id_cita BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_tratamiento),
    CONSTRAINT FK_tratamiento_cita
        FOREIGN KEY (id_cita)
        REFERENCES clinico_db.cita(id_cita)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA MEDICAMENTO
-- ==========================================================

CREATE TABLE IF NOT EXISTS medicamento_db.medicamento (
    id_medicamento BIGINT NOT NULL AUTO_INCREMENT,
    nombre_comercial VARCHAR(200) NOT NULL,
    principio_activo VARCHAR(200),
    unidad_medida VARCHAR(50),
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_medicamento)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS medicamento_db.tratamiento_medicamento (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cantidad INT,
    dosis VARCHAR(100),
    id_medicamento BIGINT NOT NULL,
    id_tratamiento BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT FK_tratamiento_medicamento_medicamento
        FOREIGN KEY (id_medicamento)
        REFERENCES medicamento_db.medicamento(id_medicamento),
    CONSTRAINT FK_tratamiento_medicamento_tratamiento
        FOREIGN KEY (id_tratamiento)
        REFERENCES clinico_db.tratamiento(id_tratamiento)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA INVENTARIO
-- ==========================================================

CREATE TABLE IF NOT EXISTS inventario_db.bodega (
    id_bodega BIGINT NOT NULL AUTO_INCREMENT,
    nombre_bodega VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200),
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_bodega)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS inventario_db.inventario_medicamento (
    id_inventario BIGINT NOT NULL AUTO_INCREMENT,
    stock_actual INT,
    stock_minimo INT,
    unidad_medida VARCHAR(50),
    id_bodega BIGINT NOT NULL,
    id_medicamento BIGINT NOT NULL,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_inventario),
    CONSTRAINT FK_inventario_bodega
        FOREIGN KEY (id_bodega)
        REFERENCES inventario_db.bodega(id_bodega),
    CONSTRAINT FK_inventario_medicamento
        FOREIGN KEY (id_medicamento)
        REFERENCES medicamento_db.medicamento(id_medicamento)
) ENGINE=InnoDB;

-- ===========================================
-- ESQUEMA HOSPITALARIO
-- ===========================================

CREATE TABLE IF NOT EXISTS hospitalario_db.area (
    id_area BIGINT NOT NULL AUTO_INCREMENT,
    nombre_area VARCHAR(100) NOT NULL,    -- Intensivo, Maternidad, Urgencias, etc.
    descripcion VARCHAR(200),
    capacidad INT,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_area),
    UNIQUE KEY UK_nombre_area (nombre_area)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hospitalario_db.ingreso_egreso (
    id_ingreso BIGINT NOT NULL AUTO_INCREMENT,
    id_paciente BIGINT NOT NULL,
    id_area BIGINT NOT NULL,
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_egreso DATETIME,                -- NULL mientras sigue internado
    motivo_ingreso TEXT,
    motivo_egreso TEXT,                   -- NULL mientras sigue internado
    estado VARCHAR(20) NOT NULL DEFAULT 'INTERNADO', -- INTERNADO, EGRESADO, TRASLADADO
    observaciones TEXT,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_ingreso),
    FOREIGN KEY (id_paciente) REFERENCES clinico_db.paciente(id_paciente),
    FOREIGN KEY (id_area) REFERENCES area(id_area)
) ENGINE=InnoDB;


INSERT INTO administrativo_db.rol_padre (nombre_rol_padre,usuario_registro,usuario_modificacion,fecha_creacion,fecha_modificacion,activo) VALUES
	 ('admin','system',NULL,'2026-05-31 21:50:44',NULL,1),
	 ('auxiliar','system',NULL,'2026-05-31 21:50:44',NULL,1),
	 ('doctor','system',NULL,'2026-05-31 21:50:44',NULL,1),
	 ('paciente','system',NULL,'2026-05-31 21:50:44',NULL,1);

-- ==========================================================
-- DATOS INICIALES - PERMISOS
-- ==========================================================

INSERT INTO administrativo_db.permiso (
    nombre_permiso,
    usuario_registro,
    usuario_modificacion,
    fecha_creacion,
    fecha_modificacion,
    activo
) VALUES
('appointment.module','system',NULL,NOW(),NULL,1),
('appointment.view.all','system',NULL,NOW(),NULL,1),
('appointment.create','system',NULL,NOW(),NULL,1),
('appointment.edit','system',NULL,NOW(),NULL,1),
('appointment.filter','system',NULL,NOW(),NULL,1),
('appointment.view.detail','system',NULL,NOW(),NULL,1),
('appointment.view.patient.record','system',NULL,NOW(),NULL,1),
('appointment.view.attend','system',NULL,NOW(),NULL,1),
('appointment.cancel','system',NULL,NOW(),NULL,1),

('patient.module','system',NULL,NOW(),NULL,1),
('patient.create','system',NULL,NOW(),NULL,1),
('patient.edit','system',NULL,NOW(),NULL,1),
('patient.view.detail','system',NULL,NOW(),NULL,1),
('patient.inactivate','system',NULL,NOW(),NULL,1),

('admin.module','system',NULL,NOW(),NULL,1),
('admin.manager.roles','system',NULL,NOW(),NULL,1),
('admin.manager.roles.create','system',NULL,NOW(),NULL,1),
('admin.manager.roles.edit','system',NULL,NOW(),NULL,1),
('admin.manager.roles.inactivate','system',NULL,NOW(),NULL,1),
('admin.manager.users','system',NULL,NOW(),NULL,1),
('admin.manager.permissions','system',NULL,NOW(),NULL,1),
('admin.manager.permissions.edit','system',NULL,NOW(),NULL,1),
('admin.manager.permissions.create','system',NULL,NOW(),NULL,1),
('admin.manager.permissions.inactivate','system',NULL,NOW(),NULL,1),
('admin.etl.loads','system',NULL,NOW(),NULL,1),

('hospital.module','system',NULL,NOW(),NULL,1),
('hospital.create.admission','system',NULL,NOW(),NULL,1),
('hospital.transfer','system',NULL,NOW(),NULL,1),
('hospital.egress','system',NULL,NOW(),NULL,1),
('hospital.transfer.historical','system',NULL,NOW(),NULL,1),
('hospital.view.admission.detail','system',NULL,NOW(),NULL,1),
('hospital.admission.view.all','system',NULL,NOW(),NULL,1),
('hospital.manage.doctors','system',NULL,NOW(),NULL,1),

('audit.access.logs','system',NULL,NOW(),NULL,1),
('audit.access.payloads','system',NULL,NOW(),NULL,1),

('inventory.module','system',NULL,NOW(),NULL,1),
('inventory.create','system',NULL,NOW(),NULL,1),
('inventory.edit','system',NULL,NOW(),NULL,1),
('store.create','system',NULL,NOW(),NULL,1),
('store.edit','system',NULL,NOW(),NULL,1);


-- ==========================================================
-- DATOS INICIALES - SUPERADMIN
-- ==========================================================

INSERT INTO administrativo_db.rol_padre (
    nombre_rol_padre,
    usuario_registro,
    usuario_modificacion,
    fecha_creacion,
    fecha_modificacion,
    activo
)
VALUES (
    'superadmin',
    'system',
    NULL,
    NOW(),
    NULL,
    1
);


INSERT INTO administrativo_db.rol (
    nombre_rol,
    id_rol_padre,
    usuario_registro,
    usuario_modificacion,
    fecha_creacion,
    fecha_modificacion,
    activo
)
SELECT
    'SUPERADMIN',
    rp.id_rol_padre,
    'system',
    NULL,
    NOW(),
    NULL,
    1
FROM administrativo_db.rol_padre rp
WHERE rp.nombre_rol_padre = 'superadmin';


INSERT INTO administrativo_db.rol_permiso (
    id_rol,
    id_permiso,
    usuario_registro,
    usuario_modificacion,
    fecha_creacion,
    fecha_modificacion,
    activo
)
SELECT
    r.id_rol,
    p.id_permiso,
    'system',
    NULL,
    NOW(),
    NULL,
    1
FROM administrativo_db.rol r
JOIN administrativo_db.permiso p
WHERE r.nombre_rol = 'SUPERADMIN';


INSERT INTO administrativo_db.usuario_sistema (
    activo,
    email,
    id_keycloak,
    nombres,
    apellidos,
    username,
    usuario_registro,
    usuario_modificacion,
    fecha_creacion,
    fecha_modificacion
)
VALUES (
    1,
    'superadmin@hospital.local',
    '7184bce0-a2d8-4f3e-b117-d65f6fb3d8cc',
    'Super',
    'Admin',
    'superadmin',
    'system',
    NULL,
    NOW(),
    NULL
);


INSERT INTO administrativo_db.usuario_rol (
    id_usuario,
    id_rol,
    usuario_registro,
    usuario_modificacion,
    fecha_creacion,
    fecha_modificacion,
    activo
)
SELECT
    u.id_usuario,
    r.id_rol,
    'system',
    NULL,
    NOW(),
    NULL,
    1
FROM administrativo_db.usuario_sistema u
JOIN administrativo_db.rol r
    ON r.nombre_rol = 'SUPERADMIN'
WHERE u.username = 'superadmin';