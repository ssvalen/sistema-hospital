package com.hospitaldb.backend.controller.medicamentos;

import com.hospitaldb.backend.dto.request.MedicamentoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.medicamentos.MedicamentoDTO;
import com.hospitaldb.backend.entity.medicamentos.Medicamento;
import com.hospitaldb.backend.service.medicamentos.MedicamentoService;
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
@RequestMapping("/api/hospitaldb/medicamentos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MedicamentoController {
    private final MedicamentoService medicamentoService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<MedicamentoDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/medicamentos - Listando todos los medicamentos");
        List<MedicamentoDTO> medicamentos = medicamentoService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(medicamentos, "Medicamentos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<MedicamentoDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/medicamentos/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombreComercial").ascending());
        Page<MedicamentoDTO> pageResult = medicamentoService.findAll(pageable);

        PaginatedResponse<MedicamentoDTO> response = PaginatedResponse.<MedicamentoDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Medicamentos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<MedicamentoDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/medicamentos/{} - Buscando medicamento", id);
        MedicamentoDTO medicamento = medicamentoService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(medicamento, "Medicamento encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<MedicamentoDTO>> create(
            @Valid @RequestBody MedicamentoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/medicamentos - Creando nuevo medicamento: {}", requestDTO.getNombreComercial());
        MedicamentoDTO created = medicamentoService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Medicamento creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<MedicamentoDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody MedicamentoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/medicamentos/{} - Actualizando medicamento", id);
        MedicamentoDTO updated = medicamentoService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Medicamento actualizado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/medicamentos/{} - Eliminando medicamento", id);
        medicamentoService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Medicamento eliminado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/search")
    public ResponseEntity<EntityResponse<List<MedicamentoDTO>>> search(
            @RequestParam String q,
            HttpServletRequest request) {

        log.info("GET /api/medicamentos/search - Buscando: {}", q);
        List<MedicamentoDTO> medicamentos = medicamentoService.searchMedicamentos(q);

        return ResponseEntity.ok(
                EntityResponse.success(medicamentos, "Búsqueda completada", request.getRequestURI())
        );
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<EntityResponse<List<MedicamentoDTO>>> getByNombre(
            @PathVariable String nombre,
            HttpServletRequest request) {

        log.info("GET /api/medicamentos/nombre/{} - Buscando por nombre", nombre);
        List<MedicamentoDTO> medicamentos = medicamentoService.searchByNombre(nombre);

        return ResponseEntity.ok(
                EntityResponse.success(medicamentos, "Medicamentos por nombre obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/principio-activo/{principioActivo}")
    public ResponseEntity<EntityResponse<List<MedicamentoDTO>>> getByPrincipioActivo(
            @PathVariable String principioActivo,
            HttpServletRequest request) {

        log.info("GET /api/medicamentos/principio-activo/{} - Buscando por principio activo", principioActivo);
        List<MedicamentoDTO> medicamentos = medicamentoService.findByPrincipioActivo(principioActivo);

        return ResponseEntity.ok(
                EntityResponse.success(medicamentos, "Medicamentos por principio activo obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/mas-recetados")
    public ResponseEntity<EntityResponse<List<Object[]>>> getMasRecetados(HttpServletRequest request) {
        log.info("GET /api/medicamentos/mas-recetados - Medicamentos más recetados");
        List<Object[]> resultados = medicamentoService.findMedicamentosMasRecetados();

        return ResponseEntity.ok(
                EntityResponse.success(resultados, "Medicamentos más recetados obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<EntityResponse<List<MedicamentoDTO>>> getConStockBajo(HttpServletRequest request) {
        log.info("GET /api/medicamentos/stock-bajo - Medicamentos con stock bajo");
        List<MedicamentoDTO> medicamentos = medicamentoService.findMedicamentosConStockBajo();

        return ResponseEntity.ok(
                EntityResponse.success(medicamentos, "Medicamentos con stock bajo obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/sin-inventario")
    public ResponseEntity<EntityResponse<List<MedicamentoDTO>>> getSinInventario(HttpServletRequest request) {
        log.info("GET /api/medicamentos/sin-inventario - Medicamentos sin inventario");
        List<MedicamentoDTO> medicamentos = medicamentoService.findMedicamentosSinInventario();

        return ResponseEntity.ok(
                EntityResponse.success(medicamentos, "Medicamentos sin inventario obtenidos", request.getRequestURI())
        );
    }
}
