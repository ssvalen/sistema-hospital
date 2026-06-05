package com.hospitaldb.backend.dto.request.etl;

import com.hospitaldb.backend.enums.EtlLoadType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "Formulario ETL para carga de archivos CSV")
public class EtlUploadRequestDTO {

    @NotNull(message = "El archivo es obligatorio")
    @Schema(
            description = "Archivo CSV",
            type = "string",
            format = "binary"
    )
    private MultipartFile file;

    @NotNull(message = "El tipo de carga es obligatorio")
    @Schema(
            description = "Tipo de carga",
            example = "PACIENTES",
            allowableValues = {"PACIENTES", "INVENTARIO"}
    )
    private EtlLoadType loadType;

}