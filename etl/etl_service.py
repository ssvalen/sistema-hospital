import os
import time
import logging
import csv
import shutil
from datetime import datetime
import mysql.connector
from mysql.connector import Error
import config

# Configuración de logging
def setup_logging():
    os.makedirs(config.LOG_DIR, exist_ok=True)
    
    log_format = "%(asctime)s - %(levelname)s - %(message)s"
    
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.FileHandler(f"{config.LOG_DIR}/etl_general.log"),
            logging.StreamHandler()
        ]
    )
    
    error_handler = logging.FileHandler(f"{config.LOG_DIR}/errores.log")
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(logging.Formatter(log_format))
    logging.getLogger().addHandler(error_handler)

setup_logging()
logger = logging.getLogger(__name__)

class MySQLConnection:
    @staticmethod
    def get_connection():
        try:
            connection = mysql.connector.connect(**config.DB_CONFIG)
            return connection
        except Error as e:
            logger.error(f"Error conectando a MySQL: {e}")
            return None

class CSVProcessor:
    
    @staticmethod
    def validar_estructura_csv(file_path, columnas_requeridas):
        try:
            with open(file_path, "r", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                columnas_archivo = [col.lower().strip() for col in reader.fieldnames]
                columnas_requeridas_norm = [col.lower() for col in columnas_requeridas]
                
                missing_cols = set(columnas_requeridas_norm) - set(columnas_archivo)
                if missing_cols:
                    return False, f"Columnas faltantes: {missing_cols}"
                return True, "OK"
        except Exception as e:
            return False, str(e)
    
    #se agrega validación para solo insertar nuevos registros según ID
    @staticmethod
    def procesar_pacientes(file_path):
        connection = MySQLConnection.get_connection()
        if not connection:
            return False, "No se pudo conectar a la base de datos", []
        
        cursor = connection.cursor()
        exitosos = 0
        omitidos = 0
        errores = []
        
        try:
            with open(file_path, "r", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        nombre = row.get("nombre", "").strip()
                        apellido = row.get("apellido", "").strip()
                        telefono = row.get("telefono", "").strip()
                        
                        # Verificar si ya existe por nombre, apellido y teléfono
                        check_query = """
                            SELECT id_paciente FROM clinico_db.paciente 
                            WHERE nombre = %s AND apellido = %s AND telefono = %s
                        """
                        cursor.execute(check_query, (nombre, apellido, telefono))
                        existe = cursor.fetchone()
                        
                        if existe:
                            omitidos += 1
                            logger.info(f"Paciente ya existe (omitido): {nombre} {apellido}")
                            continue
                        
                        # Convertir fecha
                        fecha_nac = row.get("fecha_nacimiento", "")
                        if fecha_nac and "/" in fecha_nac:
                            partes = fecha_nac.split("/")
                            if len(partes) == 3:
                                fecha_nac = f"{partes[2]}-{partes[1]}-{partes[0]}"
                        
                        query = """
                            INSERT INTO clinico_db.paciente 
                            (nombre, apellido, fecha_nacimiento, genero, telefono, direccion)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """
                        values = (
                            nombre,
                            apellido,
                            fecha_nac or None,
                            row.get("genero", ""),
                            telefono,
                            row.get("direccion", "")
                        )
                        cursor.execute(query, values)
                        exitosos += 1
                        logger.info(f"Insertado paciente: {nombre} {apellido}")
                        
                    except Exception as e:
                        errores.append(f"Fila {row_num}: {str(e)}")
                        logger.error(f"Error fila {row_num}: {e}")
            
            connection.commit()
            return True, f"Insertados {exitosos} pacientes. Omitidos {omitidos}. Errores: {len(errores)}", errores
            
        except Exception as e:
            connection.rollback()
            return False, str(e), []
        finally:
            cursor.close()
            connection.close()
    
     #se agrega validación para solo insertar nuevos inventarios según ID
    @staticmethod
    def procesar_inventario(file_path):
        connection = MySQLConnection.get_connection()
        if not connection:
            return False, "No se pudo conectar a la base de datos", []
        
        cursor = connection.cursor()
        exitosos = 0
        omitidos = 0
        errores = []
        
        try:
            with open(file_path, "r", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        id_medicamento = int(row.get("id_medicamento", 0))
                        id_bodega = int(row.get("id_bodega", 1))
                        
                        # Verificar si ya existe
                        check_query = """
                            SELECT id_inventario FROM inventario_db.inventario_medicamento 
                            WHERE id_medicamento = %s AND id_bodega = %s
                        """
                        cursor.execute(check_query, (id_medicamento, id_bodega))
                        existe = cursor.fetchone()
                        
                        if existe:
                            omitidos += 1
                            logger.info(f"Inventario ya existe (omitido): Medicamento {id_medicamento} en Bodega {id_bodega}")
                            continue
                        
                        stock_actual = int(row.get("stock_actual", 0))
                        stock_minimo = int(row.get("stock_minimo", 0))
                        unidad_medida = row.get("unidad_medida", "Unidad")
                        
                        query = """
                            INSERT INTO inventario_db.inventario_medicamento 
                            (id_medicamento, stock_actual, stock_minimo, unidad_medida, id_bodega)
                            VALUES (%s, %s, %s, %s, %s)
                        """
                        cursor.execute(query, (id_medicamento, stock_actual, stock_minimo, unidad_medida, id_bodega))
                        exitosos += 1
                        logger.info(f"Insertado inventario: Medicamento {id_medicamento} (stock: {stock_actual})")
                        
                    except Exception as e:
                        errores.append(f"Fila {row_num}: {str(e)}")
                        logger.error(f"Error fila {row_num}: {e}")
            
            connection.commit()
            return True, f"Insertados {exitosos} registros. Omitidos {omitidos}. Errores: {len(errores)}", errores
            
        except Exception as e:
            connection.rollback()
            return False, str(e), []
        finally:
            cursor.close()
            connection.close()
    
    #se agrega validación para solo insertar nuevos registros de bodega según ID
    @staticmethod
    def procesar_bodega(file_path):
        connection = MySQLConnection.get_connection()
        if not connection:
            return False, "No se pudo conectar a la base de datos", []
        
        cursor = connection.cursor()
        exitosos = 0
        omitidos = 0
        errores = []
        
        try:
            with open(file_path, "r", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        nombre_bodega = row.get("nombre_bodega", "").strip()
                        
                        # Verificar si ya existe por nombre
                        check_query = """
                            SELECT id_bodega FROM inventario_db.bodega 
                            WHERE nombre_bodega = %s
                        """
                        cursor.execute(check_query, (nombre_bodega,))
                        existe = cursor.fetchone()
                        
                        if existe:
                            omitidos += 1
                            logger.info(f"Bodega ya existe (omitida): {nombre_bodega}")
                            continue
                        
                        ubicacion = row.get("ubicacion", "")
                        
                        query = """
                            INSERT INTO inventario_db.bodega 
                            (nombre_bodega, ubicacion, activo)
                            VALUES (%s, %s, 1)
                        """
                        cursor.execute(query, (nombre_bodega, ubicacion))
                        exitosos += 1
                        logger.info(f"Insertada bodega: {nombre_bodega}")
                        
                    except Exception as e:
                        errores.append(f"Fila {row_num}: {str(e)}")
                        logger.error(f"Error fila {row_num}: {e}")
            
            connection.commit()
            return True, f"Insertadas {exitosos} bodegas. Omitidas {omitidos}. Errores: {len(errores)}", errores
            
        except Exception as e:
            connection.rollback()
            return False, str(e), []
        finally:
            cursor.close()
            connection.close()
    
     #se agrega validación para solo insertar nuevos registros de medicamentos según ID
    @staticmethod
    def procesar_medicamento(file_path):
        connection = MySQLConnection.get_connection()
        if not connection:
            return False, "No se pudo conectar a la base de datos", []
        
        cursor = connection.cursor()
        exitosos = 0
        omitidos = 0
        errores = []
        
        try:
            with open(file_path, "r", encoding="utf-8-sig") as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        nombre_comercial = row.get("nombre_comercial", "").strip()
                        
                        # Verificar si ya existe por nombre_comercial
                        check_query = """
                            SELECT id_medicamento FROM medicamento_db.medicamento 
                            WHERE nombre_comercial = %s
                        """
                        cursor.execute(check_query, (nombre_comercial,))
                        existe = cursor.fetchone()
                        
                        if existe:
                            omitidos += 1
                            logger.info(f"Medicamento ya existe (omitido): {nombre_comercial}")
                            continue
                        
                        principio_activo = row.get("principio_activo", "")
                        unidad_medida = row.get("unidad_medida", "Unidad")
                        
                        query = """
                            INSERT INTO medicamento_db.medicamento 
                            (nombre_comercial, principio_activo, unidad_medida)
                            VALUES (%s, %s, %s)
                        """
                        cursor.execute(query, (nombre_comercial, principio_activo, unidad_medida))
                        exitosos += 1
                        logger.info(f"Insertado medicamento: {nombre_comercial}")
                        
                    except Exception as e:
                        errores.append(f"Fila {row_num}: {str(e)}")
                        logger.error(f"Error fila {row_num}: {e}")
            
            connection.commit()
            return True, f"Insertados {exitosos} medicamentos. Omitidos {omitidos}. Errores: {len(errores)}", errores
            
        except Exception as e:
            connection.rollback()
            return False, str(e), []
        finally:
            cursor.close()
            connection.close()


def procesar_archivo(file_path):
    file_name = os.path.basename(file_path).lower()
    
    if not os.path.exists(file_path) or not file_path.endswith(".csv"):
        return
    
    # Determinar tipo de archivo
    tipo = None
    if file_name in config.VALID_PACIENTE_FILES:
        tipo = "paciente"
    elif file_name in config.VALID_INVENTARIO_FILES:
        tipo = "inventario"
    elif file_name in config.VALID_BODEGA_FILES:
        tipo = "bodega"
    elif file_name in config.VALID_MEDICAMENTO_FILES:
        tipo = "medicamento"
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        quarantine_path = os.path.join(config.ERROR_DIR, f"nombre_invalido_{timestamp}_{file_name}")
        shutil.move(file_path, quarantine_path)
        logger.warning(f"Nombre no válido: {file_name} movido a {quarantine_path}")
        return
    
    # Validar columnas según tipo
    if tipo == "paciente":
        columnas = config.PACIENTE_COLUMNAS
    elif tipo == "inventario":
        columnas = config.INVENTARIO_COLUMNAS
    elif tipo == "bodega":
        columnas = config.BODEGA_COLUMNAS
    elif tipo == "medicamento":
        columnas = config.MEDICAMENTO_COLUMNAS
    else:
        return
    
    valido, mensaje = CSVProcessor.validar_estructura_csv(file_path, columnas)
    
    if not valido:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        error_path = os.path.join(config.ERROR_DIR, f"{tipo}_error_{timestamp}_{file_name}")
        shutil.move(file_path, error_path)
        logger.error(f"Estructura inválida en {file_name}: {mensaje}")
        return
    
    # Procesar según tipo
    if tipo == "paciente":
        success, message, errores = CSVProcessor.procesar_pacientes(file_path)
    elif tipo == "inventario":
        success, message, errores = CSVProcessor.procesar_inventario(file_path)
    elif tipo == "bodega":
        success, message, errores = CSVProcessor.procesar_bodega(file_path)
    elif tipo == "medicamento":
        success, message, errores = CSVProcessor.procesar_medicamento(file_path)
    else:
        return
    
    if success:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        processed_path = os.path.join(config.PROCESSED_DIR, f"{tipo}_exito_{timestamp}_{file_name}")
        shutil.move(file_path, processed_path)
        logger.info(f"✅ ÉXITO - {file_name}: {message}")
        
        if errores:
            log_error_path = processed_path.replace(".csv", "_errores.log")
            with open(log_error_path, "w") as f:
                f.write(f"Archivo: {file_name}\n")
                f.write(f"Fecha: {datetime.now()}\n")
                f.write("\n".join(errores))
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        error_path = os.path.join(config.ERROR_DIR, f"{tipo}_fallo_{timestamp}_{file_name}")
        shutil.move(file_path, error_path)
        logger.error(f"FALLO - {file_name}: {message}")


def escanear_y_procesar():
    logger.info("Escaneando carpetas en busca de archivos CSV...")
    
    # Pacientes
    if os.path.exists(config.WATCH_DIR_PACIENTES):
        for file_name in os.listdir(config.WATCH_DIR_PACIENTES):
            if file_name.endswith(".csv"):
                file_path = os.path.join(config.WATCH_DIR_PACIENTES, file_name)
                logger.info(f"Archivo encontrado en pacientes: {file_name}")
                procesar_archivo(file_path)
    
    # Inventario
    if os.path.exists(config.WATCH_DIR_INVENTARIO):
        for file_name in os.listdir(config.WATCH_DIR_INVENTARIO):
            if file_name.endswith(".csv"):
                file_path = os.path.join(config.WATCH_DIR_INVENTARIO, file_name)
                logger.info(f"Archivo encontrado en inventario: {file_name}")
                procesar_archivo(file_path)
    
    # Bodega (NUEVO)
    if os.path.exists(config.WATCH_DIR_BODEGA):
        for file_name in os.listdir(config.WATCH_DIR_BODEGA):
            if file_name.endswith(".csv"):
                file_path = os.path.join(config.WATCH_DIR_BODEGA, file_name)
                logger.info(f"Archivo encontrado en bodega: {file_name}")
                procesar_archivo(file_path)
    
    # Medicamento (NUEVO)
    if os.path.exists(config.WATCH_DIR_MEDICAMENTO):
        for file_name in os.listdir(config.WATCH_DIR_MEDICAMENTO):
            if file_name.endswith(".csv"):
                file_path = os.path.join(config.WATCH_DIR_MEDICAMENTO, file_name)
                logger.info(f"Archivo encontrado en medicamento: {file_name}")
                procesar_archivo(file_path)


def iniciar_monitoreo_polling():
    for dir_path in [config.WATCH_DIR_PACIENTES, config.WATCH_DIR_INVENTARIO, 
                     config.WATCH_DIR_BODEGA, config.WATCH_DIR_MEDICAMENTO,
                     config.LOG_DIR, config.PROCESSED_DIR, config.ERROR_DIR]:
        os.makedirs(dir_path, exist_ok=True)
    
    logger.info("ETL Service Iniciado (modo polling)")
    logger.info(f"Monitoreando:")
    logger.info(f"   - Pacientes: {config.WATCH_DIR_PACIENTES}")
    logger.info(f"   - Inventario: {config.WATCH_DIR_INVENTARIO}")
    logger.info(f"   - Bodega: {config.WATCH_DIR_BODEGA}")
    logger.info(f"   - Medicamento: {config.WATCH_DIR_MEDICAMENTO}")
    logger.info(f" Intervalo de escaneo: {config.POLLING_INTERVAL} segundos")
    
    while True:
        try:
            escanear_y_procesar()
        except Exception as e:
            logger.error(f"Error en escaneo: {e}")
        
        time.sleep(config.POLLING_INTERVAL)


if __name__ == "__main__":
    logger.info("=" * 50)
    logger.info("Iniciando ETL Service - Standalone (Polling Mode)")
    logger.info("=" * 50)
    
    # Esperar a que MySQL esté listo
    logger.info("Esperando a que MySQL esté disponible...")
    time.sleep(10)
    
    iniciar_monitoreo_polling()