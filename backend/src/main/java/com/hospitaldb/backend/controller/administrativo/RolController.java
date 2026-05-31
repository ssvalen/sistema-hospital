package com.hospitaldb.backend.controller.administrativo;

import com.hospitaldb.backend.dto.request.AsignacionPermisoRequestDTO;
import com.hospitaldb.backend.dto.request.RolRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.dto.response.administrativo.PermisoDTO;
import com.hospitaldb.backend.dto.response.administrativo.RolDTO;
import com.hospitaldb.backend.dto.response.administrativo.RolPermisoDTO;
import com.hospitaldb.backend.entity.administrativo.Permiso;
import com.hospitaldb.backend.entity.administrativo.Rol;
import com.hospitaldb.backend.entity.administrativo.RolPermiso;
import com.hospitaldb.backend.service.administrativo.RolService;
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
@RequestMapping("/api/hospitaldb/administrativo/roles")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RolController {
    private final RolService rolService;

    @GetMapping
    public ResponseEntity<EntityResponse<List<RolDTO>>> getAll(HttpServletRequest request) {
        log.info("GET /api/roles - Listando todos los roles");
        List<RolDTO> roles = rolService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(roles, "Roles obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<EntityResponse<PaginatedResponse<RolDTO>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/roles/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombreRol").ascending());
        Page<RolDTO> pageResult = rolService.findAll(pageable);

        PaginatedResponse<RolDTO> response = PaginatedResponse.<RolDTO>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Roles obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityResponse<RolDTO>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/roles/{} - Buscando rol", id);
        RolDTO rol = rolService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(rol, "Rol encontrado", request.getRequestURI())
        );
    }

    @GetMapping("/nombre/{nombreRol}")
    public ResponseEntity<EntityResponse<RolDTO>> getByNombre(
            @PathVariable String nombreRol,
            HttpServletRequest request) {

        log.info("GET /api/roles/nombre/{} - Buscando por nombre", nombreRol);
        RolDTO rol = rolService.findByNombre(nombreRol);
        return ResponseEntity.ok(
                EntityResponse.success(rol, "Rol encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    public ResponseEntity<EntityResponse<RolDTO>> create(
            @Valid @RequestBody RolRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/roles - Creando nuevo rol: {}", requestDTO.getNombreRol());
        RolDTO created = rolService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Rol creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<RolDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody RolRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/roles/{} - Actualizando rol", id);
        RolDTO updated = rolService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Rol actualizado exitosamente", request.getRequestURI())
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/roles/{} - Eliminando rol", id);
        rolService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Rol eliminado exitosamente", request.getRequestURI())
        );
    }

    @PostMapping("/asignar-permiso")
    public ResponseEntity<EntityResponse<RolPermisoDTO>> asignarPermiso(
            @Valid @RequestBody AsignacionPermisoRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/roles/asignar-permiso - Asignando permiso al rol");
        RolPermisoDTO asignacion = rolService.asignarPermiso(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(asignacion, "Permiso asignado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{idRol}/permisos/{idPermiso}")
    public ResponseEntity<EntityResponse<Void>> removerPermiso(
            @PathVariable Long idRol,
            @PathVariable Long idPermiso,
            HttpServletRequest request) {

        log.info("DELETE /api/roles/{}/permisos/{} - Removiendo permiso del rol", idRol, idPermiso);
        rolService.removerPermiso(idRol, idPermiso);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Permiso removido exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{idRol}/permisos")
    public ResponseEntity<EntityResponse<List<PermisoDTO>>> getPermisosByRol(
            @PathVariable Long idRol,
            HttpServletRequest request) {

        log.info("GET /api/roles/{}/permisos - Permisos del rol", idRol);
        List<PermisoDTO> permisos = rolService.findPermisosByRol(idRol);

        return ResponseEntity.ok(
                EntityResponse.success(permisos, "Permisos del rol obtenidos", request.getRequestURI())
        );
    }
}
