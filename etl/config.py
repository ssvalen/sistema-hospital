import os

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'mysql'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'Upana1234'),
    'database': os.getenv('DB_NAME', 'clinico_db'),
    'raise_on_warnings': True
}

# Intervalo de escaneo en segundos (cada 5 segundos)
POLLING_INTERVAL = int(os.getenv("POLLING_INTERVAL", 5))

# Rutas de carpetas (dentro del contenedor)
WATCH_DIR_PACIENTES = "/app/uploads/pacientes"
WATCH_DIR_INVENTARIO = "/app/uploads/inventario"
LOG_DIR = "/app/logs"
PROCESSED_DIR = "/app/logs/procesados"
ERROR_DIR = "/app/logs/error"

# Nombres válidos de archivos
VALID_PACIENTE_FILES = ["pacientes.csv", "paciente.csv", "pacientes_nuevos.csv"]
VALID_INVENTARIO_FILES = ["inventario.csv", "inventario_medicamento.csv", "stock.csv"]

# Columnas esperadas
PACIENTE_COLUMNAS = ["nombre", "apellido", "fecha_nacimiento", "genero", "telefono", "direccion"]
INVENTARIO_COLUMNAS = ["id_medicamento", "stock_actual", "stock_minimo", "unidad_medida", "id_bodega"]