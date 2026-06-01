package com.hospitaldb.backend.controller.administrativo;

import com.hospitaldb.backend.dto.request.PermisoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.administrativo.PermisoDTO;
import com.hospitaldb.backend.entity.administrativo.Permiso;
import com.hospitaldb.backend.service.administrativo.PermisoService;
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
@RequestMapping("/api/hospitaldb/administrativo/permisos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PermisoController {
    private final PermisoService permisoService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<PermisoDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/permisos - Listando todos los permisos");
        List<PermisoDTO> permisos = permisoService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(permisos, "Permisos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<PermisoDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/permisos/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombrePermiso").ascending());
        Page<PermisoDTO> pageResult = permisoService.findAll(pageable);

        PaginatedResponse<PermisoDTO> response = PaginatedResponse.<PermisoDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Permisos obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<PermisoDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/permisos/{} - Buscando permiso", id);
        PermisoDTO permiso = permisoService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(permiso, "Permiso encontrado", request.getRequestURI())
        );
    }

    @GetMapping("/nombre/{nombrePermiso}")
    public ResponseEntity<EntityResponse<PermisoDTO>> getByNombre(
            @PathVariable String nombrePermiso,
            HttpServletRequest request) {

        log.info("GET /api/permisos/nombre/{} - Buscando por nombre", nombrePermiso);
        PermisoDTO permiso = permisoService.findByNombre(nombrePermiso);
        return ResponseEntity.ok(
                EntityResponse.success(permiso, "Permiso encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<PermisoDTO>> create(
            @Valid @RequestBody PermisoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/permisos - Creando nuevo permiso: {}", requestDTO.getNombrePermiso());
        PermisoDTO created = permisoService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Permiso creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<PermisoDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody PermisoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/permisos/{} - Actualizando permiso", id);
        PermisoDTO updated = permisoService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Permiso actualizado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/permisos/{} - Eliminando permiso", id);
        permisoService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Permiso eliminado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<EntityResponse<List<PermisoDTO>>> getPermisosByUsuario(
            @PathVariable Long idUsuario,
            HttpServletRequest request) {

        log.info("GET /api/permisos/usuario/{} - Permisos del usuario", idUsuario);
        List<PermisoDTO> permisos = permisoService.findPermisosByUsuario(idUsuario);

        return ResponseEntity.ok(
                EntityResponse.success(permisos, "Permisos del usuario obtenidos", request.getRequestURI())
        );
    }
}
