package com.hospitaldb.backend.controller.auditoria;

import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.service.auditoria.AuditLogService;
import com.hospitaldb.backend.service.auth.AccesoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/hospitaldb/auditoria/logs")
@RequiredArgsConstructor
@Slf4j
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final AccesoService accesoService;

    @GetMapping
    public ResponseEntity<?> findAll(HttpServletRequest httpServletRequest) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN);
        return ResponseEntity.ok(
                EntityResponse.success(
                        auditLogService.findAll(),
                        "Audit logs obtenidos exitosamente",
                        httpServletRequest.getRequestURI()
                )
        );
    }

    @GetMapping("/paginado")
    public ResponseEntity<?> findAllPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            HttpServletRequest httpServletRequest
            ) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN);
        return ResponseEntity.ok(
                EntityResponse.success(
                        auditLogService.findAllPaginado(page, size, sortBy, sortDir),
                        "Audit logs obtenidos exitosamente",
                        httpServletRequest.getRequestURI()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable String id, HttpServletRequest httpServletRequest) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN);
        return ResponseEntity.ok(
                EntityResponse.success(
                        auditLogService.findById(id),
                        "Audit log obtenido exitosamente",
                        httpServletRequest.getRequestURI()
                )
        );
    }

    @GetMapping("/fecha")
    public ResponseEntity<?> findByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            HttpServletRequest httpServletRequest
    ) {
       // accesoService.verificarRolPadre(RolesPadre.ADMIN);
        return ResponseEntity.ok(
                EntityResponse.success(
                        auditLogService.findByFecha(fechaInicio,fechaFin),
                        "Audit logs obtenidos para la fecha: " + fechaInicio,
                        httpServletRequest.getRequestURI()
                )
        );
    }
}
