package com.hospitaldb.backend.controller.inventario;

import com.hospitaldb.backend.dto.request.InventarioMedicamentoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.inventario.InventarioMedicamentoDTO;
import com.hospitaldb.backend.service.inventario.InventarioMedicamentoService;
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
@RequestMapping("/api/hospitaldb/inventario/inventario")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class InventarioMedicamentoController {

    private final InventarioMedicamentoService inventarioService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<InventarioMedicamentoDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/inventario - Listando todo el inventario");
        List<InventarioMedicamentoDTO> inventario = inventarioService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(inventario, "Inventario obtenido exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<InventarioMedicamentoDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/inventario/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("idInventario").descending());
        Page<InventarioMedicamentoDTO> pageResult = inventarioService.findAll(pageable);

        PaginatedResponse<InventarioMedicamentoDTO> response = PaginatedResponse.<InventarioMedicamentoDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Inventario obtenido exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<InventarioMedicamentoDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/inventario/{} - Buscando registro de inventario", id);
        InventarioMedicamentoDTO inventario = inventarioService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(inventario, "Registro encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<InventarioMedicamentoDTO>> create(
            @Valid @RequestBody InventarioMedicamentoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/inventario - Creando nuevo registro de inventario");
        InventarioMedicamentoDTO created = inventarioService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Registro de inventario creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<InventarioMedicamentoDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody InventarioMedicamentoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/inventario/{} - Actualizando registro", id);
        InventarioMedicamentoDTO updated = inventarioService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Registro actualizado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/inventario/{} - Eliminando registro", id);
        inventarioService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Registro eliminado exitosamente", request.getRequestURI())
        );
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<EntityResponse<InventarioMedicamentoDTO>> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer nuevoStock,
            HttpServletRequest request) {

        log.info("PATCH /api/inventario/{}/stock - Actualizando stock a {}", id, nuevoStock);
        InventarioMedicamentoDTO updated = inventarioService.actualizarStock(id, nuevoStock);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Stock actualizado exitosamente", request.getRequestURI())
        );
    }

    @PostMapping("/descontar")
    public ResponseEntity<EntityResponse<Void>> descontarStock(
            @RequestParam Long idMedicamento,
            @RequestParam Long idBodega,
            @RequestParam Integer cantidad,
            HttpServletRequest request) {

        log.info("POST /api/inventario/descontar - Descontando {} unidades del medicamento {}", cantidad, idMedicamento);
        inventarioService.descontarStock(idMedicamento, idBodega, cantidad);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Stock descontado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/medicamento/{idMedicamento}")
    public ResponseEntity<EntityResponse<List<InventarioMedicamentoDTO>>> getByMedicamento(
            @PathVariable Long idMedicamento,
            HttpServletRequest request) {

        log.info("GET /api/inventario/medicamento/{} - Inventario del medicamento", idMedicamento);
        List<InventarioMedicamentoDTO> inventario = inventarioService.findByMedicamento(idMedicamento);

        return ResponseEntity.ok(
                EntityResponse.success(inventario, "Inventario del medicamento obtenido", request.getRequestURI())
        );
    }

    @GetMapping("/bodega/{idBodega}")
    public ResponseEntity<EntityResponse<List<InventarioMedicamentoDTO>>> getByBodega(
            @PathVariable Long idBodega,
            HttpServletRequest request) {

        log.info("GET /api/inventario/bodega/{} - Inventario de la bodega", idBodega);
        List<InventarioMedicamentoDTO> inventario = inventarioService.findByBodega(idBodega);

        return ResponseEntity.ok(
                EntityResponse.success(inventario, "Inventario de la bodega obtenido", request.getRequestURI())
        );
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<EntityResponse<List<InventarioMedicamentoDTO>>> getProductosConStockBajo(HttpServletRequest request) {
        log.info("GET /api/inventario/stock-bajo - Productos con stock bajo");
        List<InventarioMedicamentoDTO> productos = inventarioService.findProductosConStockBajo();

        return ResponseEntity.ok(
                EntityResponse.success(productos, "Productos con stock bajo obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/sin-stock")
    public ResponseEntity<EntityResponse<List<InventarioMedicamentoDTO>>> getProductosSinStock(HttpServletRequest request) {
        log.info("GET /api/inventario/sin-stock - Productos sin stock");
        List<InventarioMedicamentoDTO> productos = inventarioService.findProductosSinStock();

        return ResponseEntity.ok(
                EntityResponse.success(productos, "Productos sin stock obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/medicamento/{idMedicamento}/stock-total")
    public ResponseEntity<EntityResponse<Integer>> getStockTotalByMedicamento(
            @PathVariable Long idMedicamento,
            HttpServletRequest request) {

        log.info("GET /api/inventario/medicamento/{}/stock-total - Stock total", idMedicamento);
        Integer stockTotal = inventarioService.getStockTotalByMedicamento(idMedicamento);

        return ResponseEntity.ok(
                EntityResponse.success(stockTotal, "Stock total obtenido", request.getRequestURI())
        );
    }
}