package com.hospitaldb.backend.service.etl;

import com.hospitaldb.backend.dto.response.etl.EtlUploadResponseDTO;
import com.hospitaldb.backend.enums.EtlLoadType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtlService {

    private static final String BASE_PATH = "/app/uploads";

    public EtlUploadResponseDTO uploadFile(MultipartFile file, EtlLoadType loadType) {

        try {
            String folder = loadType.name().toLowerCase();

            Path directory = Paths.get(BASE_PATH, folder);
            Files.createDirectories(directory);

            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));

            String filename = folder + "_" + timestamp + ".csv";

            Path target = directory.resolve(filename);
            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING);

            log.info("Archivo guardado correctamente: {}", target);

            return new EtlUploadResponseDTO(filename, target.toString());

        } catch (IOException e) {
            log.error("Error almacenando archivo ETL", e);
            throw new RuntimeException("Error almacenando archivo ETL: " + e.getMessage());
        }
    }
}