package com.hospitaldb.backend.controller.clinico;

import com.hospitaldb.backend.dto.request.PacienteRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.clinico.PacienteDTO;
import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.service.clinico.PacienteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitaldb/clinico/pacientes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PacienteController {
    private final PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<PacienteDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/pacientes - Listando todos los pacientes");
        List<PacienteDTO> pacientes = pacienteService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(pacientes, "Pacientes obtenidos exitosamente", request.getRequestURI())
        );
    }

    // Obtener pacientes paginados
    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<PacienteDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/pacientes/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("idPaciente").ascending());
        Page<PacienteDTO> pageResult = pacienteService.findAll(pageable);

        PaginatedResponse<PacienteDTO> response = PaginatedResponse.<PacienteDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Pacientes obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<PacienteDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/pacientes/{} - Buscando paciente", id);
        PacienteDTO paciente = pacienteService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(paciente, "Paciente encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<PacienteDTO>> create(
            @Valid @RequestBody PacienteRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/pacientes - Creando nuevo paciente: {}", requestDTO.getNombre());
        PacienteDTO created = pacienteService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Paciente creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<PacienteDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody PacienteRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/pacientes/{} - Actualizando paciente", id);
        PacienteDTO updated = pacienteService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Paciente actualizado exitosamente", request.getRequestURI())
        );
    }

    // Eliminar paciente
    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/pacientes/{} - Eliminando paciente", id);
        pacienteService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Paciente eliminado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/search")
    public ResponseEntity<EntityResponse<List<PacienteDTO>>> searchByNombre(
            @RequestParam String nombre,
            HttpServletRequest request) {

        log.info("GET /api/pacientes/search - Buscando por nombre: {}", nombre);
        List<PacienteDTO> pacientes = pacienteService.searchByNombre(nombre);

        return ResponseEntity.ok(
                EntityResponse.success(pacientes, "Búsqueda completada", request.getRequestURI())
        );
    }

    @GetMapping("/genero/{genero}")
    public ResponseEntity<EntityResponse<List<PacienteDTO>>> findByGenero(
            @PathVariable Character genero,
            HttpServletRequest request) {

        log.info("GET /api/pacientes/genero/{} - Filtrando por género", genero);
        List<PacienteDTO> pacientes = pacienteService.findByGenero(genero);

        return ResponseEntity.ok(
                EntityResponse.success(pacientes, "Pacientes filtrados por género", request.getRequestURI())
        );
    }

    @GetMapping("/con-citas")
    public ResponseEntity<EntityResponse<List<PacienteDTO>>> getPacientesConCitas(HttpServletRequest request) {
        log.info("GET /api/pacientes/con-citas - Pacientes que tienen citas");
        List<PacienteDTO> pacientes = pacienteService.findPacientesConCitas();

        return ResponseEntity.ok(
                EntityResponse.success(pacientes, "Pacientes con citas obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/sin-citas")
    public ResponseEntity<EntityResponse<List<PacienteDTO>>> getPacientesSinCitas(HttpServletRequest request) {
        log.info("GET /api/pacientes/sin-citas - Pacientes sin citas");
        List<PacienteDTO> pacientes = pacienteService.findPacientesSinCitas();

        return ResponseEntity.ok(
                EntityResponse.success(pacientes, "Pacientes sin citas obtenidos", request.getRequestURI())
        );
    }
}
