package com.hospitaldb.backend.dto.response.etl;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EtlUploadResponseDTO {

    private String fileName;
    private String originalFileName;
    private String processType;
    private String description;
    private LocalDateTime uploadDate;
    private Long fileSize;
    private String folder;
}