package com.hospitaldb.backend.dto.response.etl;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EtlUploadResponseDTO {
    private String fileName;
    private String path;
}