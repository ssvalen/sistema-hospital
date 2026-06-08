-- ==========================================================
-- LIMPIEZA DE ENTORNO
-- ==========================================================
DROP DATABASE IF EXISTS inventario_db;
DROP DATABASE IF EXISTS medicamento_db;
DROP DATABASE IF EXISTS clinico_db;
DROP DATABASE IF EXISTS administrativo_db;
DROP DATABASE IF EXISTS keycloak_db;
DROP DATABASE IF EXISTS hospitalario_db;

DROP USER IF EXISTS 'hospital_api_user'@'%';


-- ==========================================================
-- CREACIÓN DE BASES DE DATOS
-- ==========================================================
CREATE DATABASE IF NOT EXISTS administrativo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS clinico_db        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS medicamento_db    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS inventario_db     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS keycloak_db       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS hospitalario_db   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ==========================================================
-- USUARIO DE APLICACIÓN
-- ==========================================================
CREATE USER IF NOT EXISTS 'hospital_api_user'@'%'
IDENTIFIED BY 'Hospital@API2026!';

GRANT ALL PRIVILEGES ON administrativo_db.* TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON clinico_db.*        TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON medicamento_db.*    TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON inventario_db.*     TO 'hospital_api_user'@'%';
GRANT SELECT ON keycloak_db.*               TO 'hospital_api_user'@'%';
GRANT ALL PRIVILEGES ON hospitalario_db.*   TO 'hospital_api_user'@'%';

FLUSH PRIVILEGES;


-- ==========================================================
-- ESQUEMA ADMINISTRATIVO
-- ==========================================================

CREATE TABLE administrativo_db.usuario_sistema (
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


CREATE TABLE administrativo_db.rol_padre (
    id_rol_padre BIGINT NOT NULL AUTO_INCREMENT,
    nombre_rol_padre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol_padre),
    UNIQUE KEY UK_nombre_rol_padre (nombre_rol_padre)
) ENGINE=InnoDB;


CREATE TABLE administrativo_db.rol (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL,
    id_rol_padre BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol),
    UNIQUE KEY UK_nombre_rol (nombre_rol),
    CONSTRAINT FK_rol_rol_padre
        FOREIGN KEY (id_rol_padre)
        REFERENCES administrativo_db.rol_padre(id_rol_padre)
) ENGINE=InnoDB;


CREATE TABLE administrativo_db.permiso (
    id_permiso BIGINT NOT NULL AUTO_INCREMENT,
    nombre_permiso VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_permiso),
    UNIQUE KEY UK_nombre_permiso (nombre_permiso)
) ENGINE=InnoDB;


CREATE TABLE administrativo_db.usuario_rol (
    id BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    id_rol BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT FK_usuario_rol_usuario FOREIGN KEY (id_usuario)
        REFERENCES administrativo_db.usuario_sistema(id_usuario),
    CONSTRAINT FK_usuario_rol_rol FOREIGN KEY (id_rol)
        REFERENCES administrativo_db.rol(id_rol)
) ENGINE=InnoDB;


CREATE TABLE administrativo_db.rol_permiso (
    id BIGINT NOT NULL AUTO_INCREMENT,
    id_rol BIGINT NOT NULL,
    id_permiso BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT FK_rol_permiso_rol FOREIGN KEY (id_rol)
        REFERENCES administrativo_db.rol(id_rol),
    CONSTRAINT FK_rol_permiso_permiso FOREIGN KEY (id_permiso)
        REFERENCES administrativo_db.permiso(id_permiso)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA CLÍNICO
-- ==========================================================
CREATE TABLE clinico_db.paciente (
    id_paciente BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion TEXT,
    fecha_nacimiento DATE,
    genero VARCHAR(1),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_paciente)
) ENGINE=InnoDB;


CREATE TABLE clinico_db.medico (
    id_medico BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT FALSE,
    usuario_registro VARCHAR(100) DEFAULT 'system',
    usuario_modificacion VARCHAR(100),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_medico)
) ENGINE=InnoDB;


CREATE TABLE clinico_db.cita (
    id_cita BIGINT NOT NULL AUTO_INCREMENT,
    fecha_hora DATETIME(6) NOT NULL,
    estado VARCHAR(50),
    id_medico BIGINT NOT NULL,
    id_paciente BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_cita),
    CONSTRAINT FK_cita_medico FOREIGN KEY (id_medico)
        REFERENCES clinico_db.medico(id_medico),
    CONSTRAINT FK_cita_paciente FOREIGN KEY (id_paciente)
        REFERENCES clinico_db.paciente(id_paciente)
) ENGINE=InnoDB;


CREATE TABLE clinico_db.tratamiento (
    id_tratamiento BIGINT NOT NULL AUTO_INCREMENT,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    id_cita BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_tratamiento),
    CONSTRAINT FK_tratamiento_cita FOREIGN KEY (id_cita)
        REFERENCES clinico_db.cita(id_cita)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA MEDICAMENTO
-- ==========================================================
CREATE TABLE medicamento_db.medicamento (
    id_medicamento BIGINT NOT NULL AUTO_INCREMENT,
    nombre_comercial VARCHAR(200) NOT NULL,
    principio_activo VARCHAR(200),
    unidad_medida VARCHAR(50),
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_medicamento)
) ENGINE=InnoDB;


CREATE TABLE medicamento_db.tratamiento_medicamento (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cantidad INT,
    dosis VARCHAR(100),
    id_medicamento BIGINT NOT NULL,
    id_tratamiento BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT FK_tm_medicamento FOREIGN KEY (id_medicamento)
        REFERENCES medicamento_db.medicamento(id_medicamento),
    CONSTRAINT FK_tm_tratamiento FOREIGN KEY (id_tratamiento)
        REFERENCES clinico_db.tratamiento(id_tratamiento)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA INVENTARIO
-- ==========================================================
CREATE TABLE inventario_db.bodega (
    id_bodega BIGINT NOT NULL AUTO_INCREMENT,
    nombre_bodega VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200),
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_bodega)
) ENGINE=InnoDB;


CREATE TABLE inventario_db.inventario_medicamento (
    id_inventario BIGINT NOT NULL AUTO_INCREMENT,
    stock_actual INT,
    stock_minimo INT,
    unidad_medida VARCHAR(50),
    id_bodega BIGINT NOT NULL,
    id_medicamento BIGINT NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_inventario),
    CONSTRAINT FK_inv_bodega FOREIGN KEY (id_bodega)
        REFERENCES inventario_db.bodega(id_bodega),
    CONSTRAINT FK_inv_medicamento FOREIGN KEY (id_medicamento)
        REFERENCES medicamento_db.medicamento(id_medicamento)
) ENGINE=InnoDB;


-- ==========================================================
-- ESQUEMA HOSPITALARIO
-- ==========================================================
CREATE TABLE hospitalario_db.area (
    id_area BIGINT NOT NULL AUTO_INCREMENT,
    nombre_area VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    capacidad INT,
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_area),
    UNIQUE KEY UK_area_nombre (nombre_area)
) ENGINE=InnoDB;


CREATE TABLE hospitalario_db.ingreso_egreso (
    id_ingreso BIGINT NOT NULL AUTO_INCREMENT,
    id_paciente BIGINT NOT NULL,
    id_area BIGINT NOT NULL,
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_egreso DATETIME,
    motivo_ingreso TEXT,
    motivo_egreso TEXT,
    estado VARCHAR(20) DEFAULT 'INTERNADO',
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_ingreso),
    FOREIGN KEY (id_paciente) REFERENCES clinico_db.paciente(id_paciente),
    FOREIGN KEY (id_area) REFERENCES hospitalario_db.area(id_area)
) ENGINE=InnoDB;


-- ==========================================================
-- DATOS INICIALES
-- ==========================================================

INSERT INTO administrativo_db.rol_padre (nombre_rol_padre, activo) VALUES
('admin',1),('auxiliar',1),('doctor',1),('paciente',1);

INSERT INTO administrativo_db.permiso (nombre_permiso, activo) VALUES
('appointment.module',1),('appointment.view.all',1),('appointment.create',1),
('appointment.edit',1),('appointment.filter',1),('appointment.view.detail',1),
('appointment.view.patient.record',1),('appointment.view.attend',1),
('appointment.cancel',1),

('patient.module',1),('patient.create',1),('patient.edit',1),
('patient.view.detail',1),('patient.inactivate',1),

('admin.module',1),('admin.manager.roles',1),
('admin.manager.roles.create',1),('admin.manager.roles.edit',1),
('admin.manager.roles.inactivate',1),('admin.manager.users',1),
('admin.manager.permissions',1),('admin.manager.permissions.edit',1),
('admin.manager.permissions.create',1),('admin.manager.permissions.inactivate',1),
('admin.etl.loads',1),

('hospital.module',1),('hospital.create.admission',1),
('hospital.transfer',1),('hospital.egress',1),
('hospital.transfer.historical',1),
('hospital.view.admission.detail',1),
('hospital.admission.view.all',1),
('hospital.manage.doctors',1),

('audit.access.logs',1),('audit.access.payloads',1),

('inventory.module',1),('inventory.create',1),
('inventory.edit',1),('store.create',1),('store.edit',1);


-- ==========================================================
-- SUPERADMIN SETUP
-- ==========================================================
INSERT INTO administrativo_db.rol_padre (nombre_rol_padre, activo)
VALUES ('superadmin',1);

INSERT INTO administrativo_db.rol (nombre_rol,id_rol_padre,activo)
SELECT 'SUPERADMIN', id_rol_padre, 1
FROM administrativo_db.rol_padre
WHERE nombre_rol_padre='superadmin';

INSERT INTO administrativo_db.rol_permiso (id_rol,id_permiso,activo)
SELECT r.id_rol,p.id_permiso,1
FROM administrativo_db.rol r
JOIN administrativo_db.permiso p
WHERE r.nombre_rol='SUPERADMIN';

INSERT INTO administrativo_db.usuario_sistema
(email,id_keycloak,nombres,apellidos,username,activo,usuario_registro)
VALUES
('superadmin@hospital.local','7184bce0-a2d8-4f3e-b117-d65f6fb3d8cc','Super','Admin','superadmin',1,'system');

INSERT INTO administrativo_db.usuario_rol (id_usuario,id_rol,activo)
SELECT u.id_usuario,r.id_rol,1
FROM administrativo_db.usuario_sistema u
JOIN administrativo_db.rol r
WHERE u.username='superadmin'
AND r.nombre_rol='SUPERADMIN';
