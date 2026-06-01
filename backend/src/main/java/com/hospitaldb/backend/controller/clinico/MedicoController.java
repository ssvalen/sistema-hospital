package com.hospitaldb.backend.controller.clinico;

import com.hospitaldb.backend.dto.request.MedicoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.clinico.MedicoDTO;
import com.hospitaldb.backend.service.clinico.MedicoService;
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
@RequestMapping("/api/hospitaldb/clinico/medicos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MedicoController {
    private final MedicoService medicoService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<MedicoDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/medicos - Listando todos los médicos");
        List<MedicoDTO> medicos = medicoService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(medicos, "Médicos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<MedicoDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/medicos/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombre").ascending());
        Page<MedicoDTO> pageResult = medicoService.findAll(pageable);

        PaginatedResponse<MedicoDTO> response = PaginatedResponse.<MedicoDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Médicos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<MedicoDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/medicos/{} - Buscando médico", id);
        MedicoDTO medico = medicoService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(medico, "Médico encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<MedicoDTO>> create(
            @Valid @RequestBody MedicoRequestDTO requestDTO,
            HttpServletRequest request
    ) {

        log.info("POST /api/medicos - Creando nuevo médico: {}", requestDTO.getNombre());
        MedicoDTO created = medicoService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Médico creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<MedicoDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody MedicoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/medicos/{} - Actualizando médico", id);
        MedicoDTO updated = medicoService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Médico actualizado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/medicos/{} - Eliminando médico", id);
        medicoService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Médico eliminado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/especialidad/{especialidad}")
    public ResponseEntity<EntityResponse<List<MedicoDTO>>> getByEspecialidad(
            @PathVariable String especialidad,
            HttpServletRequest request) {

        log.info("GET /api/medicos/especialidad/{} - Buscando por especialidad", especialidad);
        List<MedicoDTO> medicos = medicoService.findByEspecialidad(especialidad);

        return ResponseEntity.ok(
                EntityResponse.success(medicos, "Médicos por especialidad obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/disponibles")
    public ResponseEntity<EntityResponse<List<MedicoDTO>>> getMedicosDisponibles(
            @RequestParam(defaultValue = "5") Long maxCitas,
            HttpServletRequest request) {

        log.info("GET /api/medicos/disponibles - Médicos con menos de {} citas", maxCitas);
        List<MedicoDTO> medicos = medicoService.findMedicosDisponibles(maxCitas);

        return ResponseEntity.ok(
                EntityResponse.success(medicos, "Médicos disponibles obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/especialidades")
    public ResponseEntity<EntityResponse<List<String>>> getEspecialidades(HttpServletRequest request) {
        log.info("GET /api/medicos/especialidades - Listando especialidades");
        List<String> especialidades = medicoService.findAllEspecialidades();

        return ResponseEntity.ok(
                EntityResponse.success(especialidades, "Especialidades obtenidas", request.getRequestURI())
        );
    }

    @GetMapping("/mas-activos")
    public ResponseEntity<EntityResponse<List<MedicoDTO>>> getMedicosMasActivos(HttpServletRequest request) {
        log.info("GET /api/medicos/mas-activos - Médicos más activos");
        List<MedicoDTO> medicos = medicoService.findMedicosMasActivos();

        return ResponseEntity.ok(
                EntityResponse.success(medicos, "Médicos más activos obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/sin-citas")
    public ResponseEntity<EntityResponse<List<MedicoDTO>>> getMedicosSinCitas(HttpServletRequest request) {
        log.info("GET /api/medicos/sin-citas - Médicos sin citas");
        List<MedicoDTO> medicos = medicoService.findMedicosSinCitas();

        return ResponseEntity.ok(
                EntityResponse.success(medicos, "Médicos sin citas obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/citas-por-especialidad")
    public ResponseEntity<EntityResponse<List<Object[]>>> getCitasPorEspecialidad(HttpServletRequest request) {
        log.info("GET /api/medicos/citas-por-especialidad - Citas por especialidad");
        List<Object[]> resultados = medicoService.countCitasByEspecialidad();

        return ResponseEntity.ok(
                EntityResponse.success(resultados, "Citas por especialidad obtenidas", request.getRequestURI())
        );
    }
}
