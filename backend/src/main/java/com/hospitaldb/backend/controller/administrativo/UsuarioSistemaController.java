package com.hospitaldb.backend.controller.administrativo;

import com.hospitaldb.backend.dto.request.AsignacionRolRequestDTO;
import com.hospitaldb.backend.dto.request.UsuarioSistemaRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.PaginatedResponse;
import com.hospitaldb.backend.entity.administrativo.Rol;
import com.hospitaldb.backend.entity.administrativo.UsuarioRol;
import com.hospitaldb.backend.entity.administrativo.UsuarioSistema;
import com.hospitaldb.backend.service.administrativo.UsuarioSistemaService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitaldb/administrativo/usuarios")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UsuarioSistemaController {
    private final UsuarioSistemaService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntityResponse<List<UsuarioSistema>>> getAll(HttpServletRequest request) {
        log.info("GET /api/usuarios - Listando todos los usuarios");
        List<UsuarioSistema> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(
                EntityResponse.success(usuarios, "Usuarios obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/paginado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntityResponse<PaginatedResponse<UsuarioSistema>>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        log.info("GET /api/usuarios/paginado - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("idUsuario").descending());
        Page<UsuarioSistema> pageResult = usuarioService.findAll(pageable);

        PaginatedResponse<UsuarioSistema> response = PaginatedResponse.<UsuarioSistema>builder()
                .content(pageResult.getContent())
                .pageNumber(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();

        return ResponseEntity.ok(
                EntityResponse.success(response, "Usuarios obtenidos exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntityResponse<UsuarioSistema>> getById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET /api/usuarios/{} - Buscando usuario", id);
        UsuarioSistema usuario = usuarioService.findById(id);
        return ResponseEntity.ok(
                EntityResponse.success(usuario, "Usuario encontrado", request.getRequestURI())
        );
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<EntityResponse<UsuarioSistema>> getByUsername(
            @PathVariable String username,
            HttpServletRequest request) {

        log.info("GET /api/usuarios/username/{} - Buscando por username", username);
        UsuarioSistema usuario = usuarioService.findByUsername(username);
        return ResponseEntity.ok(
                EntityResponse.success(usuario, "Usuario encontrado", request.getRequestURI())
        );
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<EntityResponse<UsuarioSistema>> getByEmail(
            @PathVariable String email,
            HttpServletRequest request) {

        log.info("GET /api/usuarios/email/{} - Buscando por email", email);
        UsuarioSistema usuario = usuarioService.findByEmail(email);
        return ResponseEntity.ok(
                EntityResponse.success(usuario, "Usuario encontrado", request.getRequestURI())
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntityResponse<UsuarioSistema>> create(
            @Valid @RequestBody UsuarioSistemaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/usuarios - Creando nuevo usuario: {}", requestDTO.getUsername());
        UsuarioSistema created = usuarioService.create(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(created, "Usuario creado exitosamente", request.getRequestURI())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityResponse<UsuarioSistema>> update(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioSistemaRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("PUT /api/usuarios/{} - Actualizando usuario", id);
        UsuarioSistema updated = usuarioService.update(id, requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(updated, "Usuario actualizado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityResponse<Void>> delete(@PathVariable Long id, HttpServletRequest request) {
        log.info("DELETE /api/usuarios/{} - Eliminando usuario", id);
        usuarioService.delete(id);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Usuario eliminado exitosamente", request.getRequestURI())
        );
    }

    @PostMapping("/asignar-rol")
    public ResponseEntity<EntityResponse<UsuarioRol>> asignarRol(
            @Valid @RequestBody AsignacionRolRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/usuarios/asignar-rol - Asignando rol al usuario");
        UsuarioRol asignacion = usuarioService.asignarRol(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(asignacion, "Rol asignado exitosamente", request.getRequestURI())
        );
    }

    @DeleteMapping("/{idUsuario}/roles/{idRol}")
    public ResponseEntity<EntityResponse<Void>> removerRol(
            @PathVariable Long idUsuario,
            @PathVariable Long idRol,
            HttpServletRequest request) {

        log.info("DELETE /api/usuarios/{}/roles/{} - Removiendo rol del usuario", idUsuario, idRol);
        usuarioService.removerRol(idUsuario, idRol);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Rol removido exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/{idUsuario}/roles")
    public ResponseEntity<EntityResponse<List<Rol>>> getRolesByUsuario(
            @PathVariable Long idUsuario,
            HttpServletRequest request) {

        log.info("GET /api/usuarios/{}/roles - Roles del usuario", idUsuario);
        List<Rol> roles = usuarioService.findRolesByUsuario(idUsuario);

        return ResponseEntity.ok(
                EntityResponse.success(roles, "Roles del usuario obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/activos")
    public ResponseEntity<EntityResponse<List<UsuarioSistema>>> getUsuariosActivos(HttpServletRequest request) {
        log.info("GET /api/usuarios/activos - Usuarios activos");
        List<UsuarioSistema> usuarios = usuarioService.findUsuariosActivos();

        return ResponseEntity.ok(
                EntityResponse.success(usuarios, "Usuarios activos obtenidos", request.getRequestURI())
        );
    }

    @GetMapping("/rol/{nombreRol}")
    public ResponseEntity<EntityResponse<List<UsuarioSistema>>> getUsuariosByRol(
            @PathVariable String nombreRol,
            HttpServletRequest request) {

        log.info("GET /api/usuarios/rol/{} - Usuarios por rol", nombreRol);
        List<UsuarioSistema> usuarios = usuarioService.findUsuariosByRol(nombreRol);

        return ResponseEntity.ok(
                EntityResponse.success(usuarios, "Usuarios por rol obtenidos", request.getRequestURI())
        );
    }
}
