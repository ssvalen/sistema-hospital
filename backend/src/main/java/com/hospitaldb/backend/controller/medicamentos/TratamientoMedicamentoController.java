package com.hospitaldb.backend.controller.medicamentos;

import com.hospitaldb.backend.dto.request.TratamientoMedicamentoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento;
import com.hospitaldb.backend.service.medicamentos.TratamientoMedicamentoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitaldb/medicamentos/tratamiento-medicamentos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TratamientoMedicamentoController {
    private final TratamientoMedicamentoService tmService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<TratamientoMedicamento>>> getAll(HttpServletRequest request) {
        log.info("GET /api/tratamiento-medicamentos - Listando todas las relaciones");
        List<TratamientoMedicamento> relaciones = tmService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(relaciones, "Relaciones obtenidas exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<TratamientoMedicamento>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/tratamiento-medicamentos/{} - Buscando relación", id);
        TratamientoMedicamento relacion = tmService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(relacion, "Relación encontrada", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<TratamientoMedicamento>> create(
            @Valid @RequestBody TratamientoMedicamentoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/tratamiento-medicamentos - Asignando medicamento a tratamiento");
        TratamientoMedicamento created = tmService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Medicamento asignado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<TratamientoMedicamento>> update(
            @PathVariable Long id,
            @Valid @RequestBody TratamientoMedicamentoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/tratamiento-medicamentos/{} - Actualizando relación", id);
        TratamientoMedicamento updated = tmService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Relación actualizada exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/tratamiento-medicamentos/{} - Eliminando relación", id);
        tmService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Relación eliminada exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/tratamiento/{idTratamiento}/medicamento/{idMedicamento}")
    public ResponseEntity<EntityResponse<Void>> deleteByTratamientoAndMedicamento(
            @PathVariable Long idTratamiento,
            @PathVariable Long idMedicamento,
            HttpServletRequest request) {

        log.info("DELETE /api/tratamiento-medicamentos/tratamiento/{}/medicamento/{} - Eliminando relación", idTratamiento, idMedicamento);
        tmService.deleteByTratamientoAndMedicamento(idTratamiento, idMedicamento);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Relación eliminada exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/tratamiento/{idTratamiento}")
    public ResponseEntity<EntityResponse<List<TratamientoMedicamento>>> getByTratamiento(
            @PathVariable Long idTratamiento,
            HttpServletRequest request) {

        log.info("GET /api/tratamiento-medicamentos/tratamiento/{} - Medicamentos del tratamiento", idTratamiento);
        List<TratamientoMedicamento> relaciones = tmService.findByTratamiento(idTratamiento);

        return ResponseEntity.ok(
                EntityResponse.success(relaciones, "Medicamentos del tratamiento obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/medicamento/{idMedicamento}")
    public ResponseEntity<EntityResponse<List<TratamientoMedicamento>>> getByMedicamento(
            @PathVariable Long idMedicamento,
            HttpServletRequest request) {

        log.info("GET /api/tratamiento-medicamentos/medicamento/{} - Tratamientos del medicamento", idMedicamento);
        List<TratamientoMedicamento> relaciones = tmService.findByMedicamento(idMedicamento);

        return ResponseEntity.ok(
                EntityResponse.success(relaciones, "Tratamientos del medicamento obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/medicamento/{idMedicamento}/cantidad-total")
    public ResponseEntity<EntityResponse<Integer>> getCantidadTotalRecetada(
            @PathVariable Long idMedicamento,
            HttpServletRequest request) {

        log.info("GET /api/tratamiento-medicamentos/medicamento/{}/cantidad-total - Cantidad total recetada", idMedicamento);
        Integer cantidad = tmService.getCantidadTotalRecetada(idMedicamento);

        return ResponseEntity.ok(
                EntityResponse.success(cantidad, "Cantidad total recetada obtenida", request.getRequestURI())
        );
    }
}
