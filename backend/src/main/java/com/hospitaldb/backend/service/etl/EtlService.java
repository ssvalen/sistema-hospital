package com.hospitaldb.backend.service.etl;

import com.hospitaldb.backend.domain.etl.EtlLoadType;
import com.hospitaldb.backend.dto.request.etl.EtlUploadRequestDTO;
import com.hospitaldb.backend.dto.response.etl.EtlUploadResponseDTO;
import com.hospitaldb.backend.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EtlService {

    private static final String BASE_UPLOAD_DIR = "/app/uploads";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Transactional
    public EtlUploadResponseDTO uploadFile(MultipartFile file, EtlUploadRequestDTO request) {

        log.info("Iniciando carga ETL - Tipo: {}", request.getLoadType());

        validateFile(file);

        try {

            String folderName = resolveFolderByType(request.getLoadType());

            Path uploadPath = Paths.get(BASE_UPLOAD_DIR, folderName)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadPath);

            String uniqueName = UUID.randomUUID() + "_" + sanitize(file.getOriginalFilename());
            Path targetLocation = uploadPath.resolve(uniqueName);

            Files.copy(file.getInputStream(), targetLocation,
                    StandardCopyOption.REPLACE_EXISTING);

            log.info("Archivo ETL almacenado correctamente en {}", targetLocation);

            return EtlUploadResponseDTO.builder()
                    .fileName(uniqueName)
                    .originalFileName(file.getOriginalFilename())
                    .processType(request.getLoadType().name())
                    .description(request.getDescription())
                    .uploadDate(LocalDateTime.now())
                    .fileSize(file.getSize())
                    .folder(folderName)
                    .build();

        } catch (IOException e) {
            log.error("Error guardando archivo ETL", e);
            throw new BusinessException("Ocurrió un error almacenando el archivo");
        }
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BusinessException("Debe seleccionar un archivo CSV");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("El archivo supera el tamaño máximo permitido (10MB)");
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || !originalName.toLowerCase().endsWith(".csv")) {
            throw new BusinessException("Solo se permiten archivos con extensión .csv");
        }

        String contentType = file.getContentType();

        if (contentType != null &&
                !contentType.equals("text/csv") &&
                !contentType.equals("application/vnd.ms-excel") &&
                !contentType.equals("application/csv")) {

            throw new BusinessException("El archivo no es un CSV válido");
        }

        validateCsvContent(file);
    }

    private void validateCsvContent(MultipartFile file) {

        try (BufferedReader reader =
                     new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            String firstLine = reader.readLine();

            if (firstLine == null || firstLine.isBlank()) {
                throw new BusinessException("El archivo CSV está vacío");
            }

            if (!firstLine.contains(",")) {
                throw new BusinessException("El archivo no parece tener formato CSV válido");
            }

        } catch (IOException e) {
            log.error("Error validando contenido CSV", e);
            throw new BusinessException("No se pudo validar el contenido del archivo");
        }
    }

    private String resolveFolderByType(EtlLoadType type) {

        return switch (type) {
            case PACIENTES -> "pacientes";
            case INVENTARIO -> "inventario";
        };
    }

    private String sanitize(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    }
}