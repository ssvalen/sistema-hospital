package com.hospitaldb.backend.controller.etl;

import com.hospitaldb.backend.dto.request.etl.EtlUploadRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.etl.EtlUploadResponseDTO;
import com.hospitaldb.backend.service.etl.EtlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/hospitaldb/etl")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EtlController {

    private final EtlService etlService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<EntityResponse<EtlUploadResponseDTO>> upload(
            @RequestParam("file") MultipartFile file,
            @Valid @ModelAttribute EtlUploadRequestDTO requestDTO,
            HttpServletRequest request
    ) {

        log.info("POST /api/hospitaldb/etl/upload - Tipo: {}", requestDTO.getLoadType());

        EtlUploadResponseDTO response = etlService.uploadFile(file, requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(
                        response,
                        "Archivo ETL cargado exitosamente",
                        request.getRequestURI()
                )
        );
    }
}