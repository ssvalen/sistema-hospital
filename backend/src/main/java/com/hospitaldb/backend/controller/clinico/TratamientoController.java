package com.hospitaldb.backend.controller.clinico;

import com.hospitaldb.backend.dto.request.TratamientoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;

import com.hospitaldb.backend.dto.response.clinico.TratamientoDTO;
import com.hospitaldb.backend.service.clinico.TratamientoService;
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
@RequestMapping("/api/hospitaldb/clinico/tratamientos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TratamientoController {
    private final TratamientoService tratamientoService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<TratamientoDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/tratamientos - Listando todos los tratamientos");
        List<TratamientoDTO> tratamientos = tratamientoService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(tratamientos, "Tratamientos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<TratamientoDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/tratamientos/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaInicio"));
        Page<TratamientoDTO> pageResult = tratamientoService.findAll(pageable);

        PaginatedResponse<TratamientoDTO> response = PaginatedResponse.<TratamientoDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Tratamientos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<TratamientoDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/tratamientos/{} - Buscando tratamiento", id);
        TratamientoDTO tratamiento = tratamientoService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(tratamiento, "TratamientoDTO encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<TratamientoDTO>> create(
            @Valid @RequestBody TratamientoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/tratamientos - Creando nuevo tratamiento");
        TratamientoDTO created = tratamientoService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "TratamientoDTO creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<TratamientoDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody TratamientoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/tratamientos/{} - Actualizando tratamiento", id);
        TratamientoDTO updated = tratamientoService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "TratamientoDTO actualizado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/tratamientos/{} - Eliminando tratamiento", id);
        tratamientoService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "TratamientoDTO eliminado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/cita/{idCita}")
    public ResponseEntity<EntityResponse<List<TratamientoDTO>>> getByCita(
            @PathVariable Long idCita,
            HttpServletRequest request) {

        log.info("GET /api/tratamientos/cita/{} - Tratamientos de la cita", idCita);
        List<TratamientoDTO> tratamientos = tratamientoService.findByCita(idCita);

        return ResponseEntity.ok(
                EntityResponse.success(tratamientos, "Tratamientos de la cita obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/activos")
    public ResponseEntity<EntityResponse<List<TratamientoDTO>>> getTratamientosActivos(HttpServletRequest request) {
        log.info("GET /api/tratamientos/activos - Tratamientos activos");
        List<TratamientoDTO> tratamientos = tratamientoService.findTratamientosActivos();

        return ResponseEntity.ok(
                EntityResponse.success(tratamientos, "Tratamientos activos obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<EntityResponse<List<TratamientoDTO>>> getByPaciente(
            @PathVariable Long idPaciente,
            HttpServletRequest request) {

        log.info("GET /api/tratamientos/paciente/{} - Tratamientos del paciente", idPaciente);
        List<TratamientoDTO> tratamientos = tratamientoService.findTratamientosByPaciente(idPaciente);

        return ResponseEntity.ok(
                EntityResponse.success(tratamientos, "Tratamientos del paciente obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<EntityResponse<List<TratamientoDTO>>> getByMedico(
            @PathVariable Long idMedico,
            HttpServletRequest request) {

        log.info("GET /api/tratamientos/medico/{} - Tratamientos del médico", idMedico);
        List<TratamientoDTO> tratamientos = tratamientoService.findTratamientosByMedico(idMedico);

        return ResponseEntity.ok(
                EntityResponse.success(tratamientos, "Tratamientos del médico obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/con-medicamentos")
    public ResponseEntity<EntityResponse<List<TratamientoDTO>>> getTratamientosConMedicamentos(HttpServletRequest request) {
        log.info("GET /api/tratamientos/con-medicamentos - Tratamientos con medicamentos");
        List<TratamientoDTO> tratamientos = tratamientoService.findTratamientosConMedicamentos();

        return ResponseEntity.ok(
                EntityResponse.success(tratamientos, "Tratamientos con medicamentos obtenidos", request.getRequestURI())
        );
    }
}
