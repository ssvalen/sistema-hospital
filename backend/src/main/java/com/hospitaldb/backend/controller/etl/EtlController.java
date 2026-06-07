package com.hospitaldb.backend.controller.etl;

import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.etl.EtlUploadResponseDTO;
import com.hospitaldb.backend.enums.EtlLoadType;
import com.hospitaldb.backend.service.etl.EtlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/hospitaldb/etl")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "ETL")
@CrossOrigin(origins = "*")
public class EtlController {

        private final EtlService etlService;

        @Operation(summary = "Subir archivo ETL")
        @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<EntityResponse<EtlUploadResponseDTO>> upload(
                        @RequestPart("file") MultipartFile file,
                        @RequestPart("loadType") String loadType,
                        HttpServletRequest request) {
                EtlLoadType type = EtlLoadType.valueOf(loadType);
                
                log.info("ETL upload iniciado - tipo: {}", loadType);
                return ResponseEntity.ok(
                                EntityResponse.success(
                                                etlService.uploadFile(file, type, request),
                                                "Archivo subido correctamente",
                                                request.getRequestURI()));
        }

}