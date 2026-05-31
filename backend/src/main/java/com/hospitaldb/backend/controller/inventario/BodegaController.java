package com.hospitaldb.backend.controller.inventario;

import com.hospitaldb.backend.dto.request.BodegaRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.inventario.BodegaDTO;
import com.hospitaldb.backend.service.inventario.BodegaService;
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
@RequestMapping("/api/hospitaldb/inventario/bodegas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class BodegaController {

    private final BodegaService bodegaService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<BodegaDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/bodegas - Listando todas las bodegas");
        List<BodegaDTO> bodegas = bodegaService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(bodegas, "Bodegas obtenidas exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<BodegaDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/bodegas/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombreBodega").ascending());
        Page<BodegaDTO> pageResult = bodegaService.findAll(pageable);

        PaginatedResponse<BodegaDTO> response = PaginatedResponse.<BodegaDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Bodegas obtenidas exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<BodegaDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/bodegas/{} - Buscando bodega", id);
        BodegaDTO bodega = bodegaService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(bodega, "Bodega encontrada", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<BodegaDTO>> create(
            @Valid @RequestBody BodegaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/bodegas - Creando nueva bodega: {}", requestDTO.getNombreBodega());
        BodegaDTO created = bodegaService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Bodega creada exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<BodegaDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody BodegaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/bodegas/{} - Actualizando bodega", id);
        BodegaDTO updated = bodegaService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Bodega actualizada exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/bodegas/{} - Eliminando bodega", id);
        bodegaService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Bodega eliminada exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/con-inventario")
    public ResponseEntity<EntityResponse<List<BodegaDTO>>> getBodegasConInventario(HttpServletRequest request) {
        log.info("GET /api/bodegas/con-inventario - Bodegas con inventario");
        List<BodegaDTO> bodegas = bodegaService.findBodegasConInventario();

        return ResponseEntity.ok(
                EntityResponse.success(bodegas, "Bodegas con inventario obtenidas", request.getRequestURI())
        );
    }

    @GetMapping("/sin-inventario")
    public ResponseEntity<EntityResponse<List<BodegaDTO>>> getBodegasSinInventario(HttpServletRequest request) {
        log.info("GET /api/bodegas/sin-inventario - Bodegas sin inventario");
        List<BodegaDTO> bodegas = bodegaService.findBodegasSinInventario();

        return ResponseEntity.ok(
                EntityResponse.success(bodegas, "Bodegas sin inventario obtenidas", request.getRequestURI())
        );
    }
}