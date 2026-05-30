package com.hospitaldb.backend.controller.clinico;

import com.hospitaldb.backend.dto.request.CitaRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.entity.clinico.Cita;
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
@RequestMapping("/api/hoteldb/clinico/citas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CitaController {
    private final CitaService citaService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<Cita>>> getAll(HttpServletRequest request) {
        log.info("GET /api/citas - Listando todas las citas");
        List<Cita> citas = citaService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas obtenidas exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<Cita>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/citas/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaHora"));
        Page<Cita> pageResult = citaService.findAll(pageable);

        PaginatedResponse<Cita> response = PaginatedResponse.<Cita>builder()
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
    public ResponseEntity<EntityResponse<Cita>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/citas/{} - Buscando cita", id);
        Cita cita = citaService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(cita, "Cita encontrada", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<Cita>> create(
            @Valid @RequestBody CitaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/citas - Creando nueva cita");
        Cita created = citaService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Cita creada exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<Cita>> update(
            @PathVariable Long id,
            @Valid @RequestBody CitaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/citas/{} - Actualizando cita", id);
        Cita updated = citaService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Cita actualizada exitosamente", request.getRequestURI())
        );
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<EntityResponse<Cita>> cancel(@PathVariable Long id, HttpServletRequest request) {
        log.info("PATCH /api/citas/{}/cancelar - Cancelando cita", id);
        citaService.cancel(id);
        Cita cita = citaService.findById(id);

        return ResponseEntity.ok(
                EntityResponse.success(cita, "Cita cancelada exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/citas/{} - Eliminando cita", id);
        citaService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Cita eliminada exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<EntityResponse<List<Cita>>> getByPaciente(
            @PathVariable Long idPaciente,
            HttpServletRequest request) {

        log.info("GET /api/citas/paciente/{} - Citas del paciente", idPaciente);
        List<Cita> citas = citaService.findByPaciente(idPaciente);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas del paciente obtenidas", request.getRequestURI())
        );
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<EntityResponse<List<Cita>>> getByMedico(
            @PathVariable Long idMedico,
            HttpServletRequest request) {

        log.info("GET /api/citas/medico/{} - Citas del médico", idMedico);
        List<Cita> citas = citaService.findByMedico(idMedico);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas del médico obtenidas", request.getRequestURI())
        );
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<EntityResponse<List<Cita>>> getByEstado(
            @PathVariable String estado,
            HttpServletRequest request) {

        log.info("GET /api/citas/estado/{} - Citas por estado", estado);
        List<Cita> citas = citaService.findByEstado(estado);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas filtradas por estado", request.getRequestURI())
        );
    }

    @GetMapping("/paciente/{idPaciente}/futuras")
    public ResponseEntity<EntityResponse<List<Cita>>> getCitasFuturasByPaciente(
            @PathVariable Long idPaciente,
            HttpServletRequest request) {

        log.info("GET /api/citas/paciente/{}/futuras - Citas futuras del paciente", idPaciente);
        List<Cita> citas = citaService.findCitasFuturasByPaciente(idPaciente);

        return ResponseEntity.ok(
                EntityResponse.success(citas, "Citas futuras obtenidas", request.getRequestURI())
        );
    }
}
