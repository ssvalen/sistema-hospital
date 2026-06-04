package com.hospitaldb.backend.dto.request.etl;

import com.hospitaldb.backend.domain.etl.EtlLoadType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EtlUploadRequestDTO {

    @NotNull(message = "El tipo de carga es obligatorio")
    private EtlLoadType loadType;

    private String description;
}