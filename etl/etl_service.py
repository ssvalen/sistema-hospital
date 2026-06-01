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
    
    log_format = '%(asctime)s - %(levelname)s - %(message)s'
    
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.FileHandler(f'{config.LOG_DIR}/etl_general.log'),
            logging.StreamHandler()
        ]
    )
    
    error_handler = logging.FileHandler(f'{config.LOG_DIR}/errores.log')
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
            with open(file_path, 'r', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile)
                columnas_archivo = [col.lower().strip() for col in reader.fieldnames]
                columnas_requeridas_norm = [col.lower() for col in columnas_requeridas]
                
                missing_cols = set(columnas_requeridas_norm) - set(columnas_archivo)
                if missing_cols:
                    return False, f"Columnas faltantes: {missing_cols}"
                return True, "OK"
        except Exception as e:
            return False, str(e)
    
    @staticmethod
    def procesar_pacientes(file_path):
        connection = MySQLConnection.get_connection()
        if not connection:
            return False, "No se pudo conectar a la base de datos"
        
        cursor = connection.cursor()
        exitosos = 0
        errores = []
        
        try:
            with open(file_path, 'r', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        fecha_nac = row.get('fecha_nacimiento', '')
                        if fecha_nac and '/' in fecha_nac:
                            partes = fecha_nac.split('/')
                            if len(partes) == 3:
                                fecha_nac = f"{partes[2]}-{partes[1]}-{partes[0]}"
                        
                        query = """
                            INSERT INTO clinico_db.paciente 
                            (nombre, apellido, fecha_nacimiento, genero, telefono, direccion)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """
                        values = (
                            row.get('nombre', ''),
                            row.get('apellido', ''),
                            fecha_nac or None,
                            row.get('genero', ''),
                            row.get('telefono', ''),
                            row.get('direccion', '')
                        )
                        cursor.execute(query, values)
                        exitosos += 1
                        logger.info(f"Insertado paciente: {row.get('nombre')} {row.get('apellido')}")
                        
                    except Exception as e:
                        errores.append(f"Fila {row_num}: {str(e)}")
                        logger.error(f"Error fila {row_num}: {e}")
            
            connection.commit()
            return True, f"Procesados {exitosos} registros. Errores: {len(errores)}", errores
            
        except Exception as e:
            connection.rollback()
            return False, str(e), []
        finally:
            cursor.close()
            connection.close()
    
    @staticmethod
    def procesar_inventario(file_path):
        connection = MySQLConnection.get_connection()
        if not connection:
            return False, "No se pudo conectar a la base de datos"
        
        cursor = connection.cursor()
        exitosos = 0
        errores = []
        
        try:
            with open(file_path, 'r', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile)
                
                for row_num, row in enumerate(reader, start=2):
                    try:
                        # Versión corregida para MySQL 8.0+
                        query = """
                            INSERT INTO inventario_db.inventario_medicamento 
                                (id_medicamento, stock_actual, stock_minimo, unidad_medida, id_bodega)
                                VALUES (%s, %s, %s, %s, %s)
                        """
                        values = (
                            int(row.get('id_medicamento', 0)),
                            int(row.get('stock_actual', 0)),
                            int(row.get('stock_minimo', 0)),
                            row.get('unidad_medida', 'Unidad'),
                            int(row.get('id_bodega', 1))
                        )
                        cursor.execute(query, values)
                        exitosos += 1
                        logger.info(f"Actualizado medicamento ID: {row.get('id_medicamento')} (stock: {row.get('stock_actual')})")
                        
                    except Exception as e:
                        errores.append(f"Fila {row_num}: {str(e)}")
                        logger.error(f"Error fila {row_num}: {e}")
            
            connection.commit()
            return True, f"Procesados {exitosos} registros. Errores: {len(errores)}", errores
            
        except Exception as e:
            connection.rollback()
            return False, str(e), []
        finally:
            cursor.close()
            connection.close()

def procesar_archivo(file_path):
    """Procesar un archivo individual"""
    file_name = os.path.basename(file_path).lower()
    
    # Verificar que el archivo existe y es CSV
    if not os.path.exists(file_path) or not file_path.endswith('.csv'):
        return
    
    tipo = None
    if file_name in config.VALID_PACIENTE_FILES:
        tipo = 'paciente'
    elif file_name in config.VALID_INVENTARIO_FILES:
        tipo = 'inventario'
    else:
        # Nombres no válidos se mueven a error
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        quarantine_path = os.path.join(config.ERROR_DIR, f"nombre_invalido_{timestamp}_{file_name}")
        shutil.move(file_path, quarantine_path)
        logger.warning(f"Nombre no válido: {file_name} movido a {quarantine_path}")
        return
    
    columnas_requeridas = config.PACIENTE_COLUMNAS if tipo == 'paciente' else config.INVENTARIO_COLUMNAS
    valido, mensaje = CSVProcessor.validar_estructura_csv(file_path, columnas_requeridas)
    
    if not valido:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        error_path = os.path.join(config.ERROR_DIR, f"{tipo}_error_{timestamp}_{file_name}")
        shutil.move(file_path, error_path)
        logger.error(f"Estructura inválida en {file_name}: {mensaje}")
        return
    
    if tipo == 'paciente':
        success, message, errores = CSVProcessor.procesar_pacientes(file_path)
    else:
        success, message, errores = CSVProcessor.procesar_inventario(file_path)
    
    if success:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        processed_path = os.path.join(config.PROCESSED_DIR, f"{tipo}_exito_{timestamp}_{file_name}")
        shutil.move(file_path, processed_path)
        logger.info(f"ÉXITO - {file_name}: {message}")
        
        if errores:
            log_error_path = processed_path.replace('.csv', '_errores.log')
            with open(log_error_path, 'w') as f:
                f.write(f"Archivo: {file_name}\n")
                f.write(f"Fecha: {datetime.now()}\n")
                f.write("\n".join(errores))
    else:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        error_path = os.path.join(config.ERROR_DIR, f"{tipo}_fallo_{timestamp}_{file_name}")
        shutil.move(file_path, error_path)
        logger.error(f"FALLO - {file_name}: {message}")

def escanear_y_procesar():
    """Escanea las carpetas y procesa archivos pendientes"""
    logger.info("🔍 Escaneando carpetas en busca de archivos CSV...")
    
    # Escanear carpeta de pacientes
    if os.path.exists(config.WATCH_DIR_PACIENTES):
        for file_name in os.listdir(config.WATCH_DIR_PACIENTES):
            if file_name.endswith('.csv'):
                file_path = os.path.join(config.WATCH_DIR_PACIENTES, file_name)
                logger.info(f"Archivo encontrado en pacientes: {file_name}")
                procesar_archivo(file_path)
    
    # Escanear carpeta de inventario
    if os.path.exists(config.WATCH_DIR_INVENTARIO):
        for file_name in os.listdir(config.WATCH_DIR_INVENTARIO):
            if file_name.endswith('.csv'):
                file_path = os.path.join(config.WATCH_DIR_INVENTARIO, file_name)
                logger.info(f"Archivo encontrado en inventario: {file_name}")
                procesar_archivo(file_path)

def iniciar_monitoreo_polling():
    """Monitoreo por polling (más confiable en Docker)"""
    # Crear directorios
    for dir_path in [config.WATCH_DIR_PACIENTES, config.WATCH_DIR_INVENTARIO, 
                     config.LOG_DIR, config.PROCESSED_DIR, config.ERROR_DIR]:
        os.makedirs(dir_path, exist_ok=True)
    
    logger.info("ETL Service Iniciado (modo polling)")
    logger.info(f"Monitoreando:")
    logger.info(f"   - Pacientes: {config.WATCH_DIR_PACIENTES}")
    logger.info(f"   - Inventario: {config.WATCH_DIR_INVENTARIO}")
    logger.info(f" Intervalo de escaneo: {config.POLLING_INTERVAL} segundos")
    
    # Procesar archivos existentes al inicio
    escanear_y_procesar()
    
    # Bucle de monitoreo
    archivos_procesados = set()
    
    try:
        while True:
            # Verificar archivos nuevos en pacientes
            if os.path.exists(config.WATCH_DIR_PACIENTES):
                for file_name in os.listdir(config.WATCH_DIR_PACIENTES):
                    if file_name.endswith('.csv'):
                        file_path = os.path.join(config.WATCH_DIR_PACIENTES, file_name)
                        # Usar timestamp para evitar reprocesar el mismo archivo
                        file_key = f"pacientes_{file_name}_{os.path.getmtime(file_path)}"
                        if file_key not in archivos_procesados:
                            archivos_procesados.add(file_key)
                            logger.info(f"Archivo detectado en pacientes: {file_name}")
                            procesar_archivo(file_path)
            
            # Verificar archivos nuevos en inventario
            if os.path.exists(config.WATCH_DIR_INVENTARIO):
                for file_name in os.listdir(config.WATCH_DIR_INVENTARIO):
                    if file_name.endswith('.csv'):
                        file_path = os.path.join(config.WATCH_DIR_INVENTARIO, file_name)
                        file_key = f"inventario_{file_name}_{os.path.getmtime(file_path)}"
                        if file_key not in archivos_procesados:
                            archivos_procesados.add(file_key)
                            logger.info(f"Archivo detectado en inventario: {file_name}")
                            procesar_archivo(file_path)
            
            # Limpiar archivos_procesados viejos (opcional, para no crecer infinito)
            if len(archivos_procesados) > 1000:
                archivos_procesados.clear()
            
            time.sleep(config.POLLING_INTERVAL)
            
    except KeyboardInterrupt:
        logger.info("ETL Service detenido")

if __name__ == "__main__":
    logger.info("=" * 50)
    logger.info("Iniciando ETL Service - Standalone (Polling Mode)")
    logger.info("=" * 50)
    iniciar_monitoreo_polling()