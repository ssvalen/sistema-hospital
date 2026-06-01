package com.hospitaldb.backend.controller.clinico;

import com.hospitaldb.backend.dto.request.CitaRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.clinico.CitaDTO;
import com.hospitaldb.backend.service.clinico.CitaService;
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
@RequestMapping("/api/hospitaldb/clinico/citas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CitaController {
    private final CitaService citaService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<CitaDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/citas - Listando todas las citas");
        List<CitaDTO> citas = citaService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas obtenidas exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<CitaDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/citas/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaHora"));
        Page<CitaDTO> pageResult = citaService.findAll(pageable);

        PaginatedResponse<CitaDTO> response = PaginatedResponse.<CitaDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Citas obtenidas exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<CitaDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/citas/{} - Buscando cita", id);
        CitaDTO cita = citaService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(cita, "CitaDTO encontrada", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<CitaDTO>> create(
            @Valid @RequestBody CitaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/citas - Creando nueva cita");
        CitaDTO created = citaService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "CitaDTO creada exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<CitaDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CitaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/citas/{} - Actualizando cita", id);
        CitaDTO updated = citaService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "CitaDTO actualizada exitosamente", request.getRequestURI())
        );
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<EntityResponse<CitaDTO>> cancel(@PathVariable Long id, HttpServletRequest request) {
        log.info("PATCH /api/citas/{}/cancelar - Cancelando cita", id);
        citaService.cancel(id);
        CitaDTO cita = citaService.findById(id);

        return ResponseEntity.ok(
                EntityResponse.success(cita, "CitaDTO cancelada exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/citas/{} - Eliminando cita", id);
        citaService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "CitaDTO eliminada exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<EntityResponse<List<CitaDTO>>> getByPaciente(
            @PathVariable Long idPaciente,
            HttpServletRequest request) {

        log.info("GET /api/citas/paciente/{} - Citas del paciente", idPaciente);
        List<CitaDTO> citas = citaService.findByPaciente(idPaciente);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas del paciente obtenidas", request.getRequestURI())
        );
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<EntityResponse<List<CitaDTO>>> getByMedico(
            @PathVariable Long idMedico,
            HttpServletRequest request) {

        log.info("GET /api/citas/medico/{} - Citas del médico", idMedico);
        List<CitaDTO> citas = citaService.findByMedico(idMedico);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas del médico obtenidas", request.getRequestURI())
        );
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<EntityResponse<List<CitaDTO>>> getByEstado(
            @PathVariable String estado,
            HttpServletRequest request) {

        log.info("GET /api/citas/estado/{} - Citas por estado", estado);
        List<CitaDTO> citas = citaService.findByEstado(estado);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas filtradas por estado", request.getRequestURI())
        );
    }

    @GetMapping("/paciente/{idPaciente}/futuras")
    public ResponseEntity<EntityResponse<List<CitaDTO>>> getCitasFuturasByPaciente(
            @PathVariable Long idPaciente,
            HttpServletRequest request) {

        log.info("GET /api/citas/paciente/{}/futuras - Citas futuras del paciente", idPaciente);
        List<CitaDTO> citas = citaService.findCitasFuturasByPaciente(idPaciente);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas futuras obtenidas", request.getRequestURI())
        );
    }
}
