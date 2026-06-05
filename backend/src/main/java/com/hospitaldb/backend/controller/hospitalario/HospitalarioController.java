package com.hospitaldb.backend.controller.hospitalario;

import com.hospitaldb.backend.dto.request.AreaRequestDTO;
import com.hospitaldb.backend.dto.request.EgresoRequestDTO;
import com.hospitaldb.backend.dto.request.IngresoRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.IngresoEgresoResponseDTO;
import com.hospitaldb.backend.service.auth.AccesoService;
import com.hospitaldb.backend.service.hospitalario.AreaService;
import com.hospitaldb.backend.service.hospitalario.IngresoEgresoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/hospitaldb/hospitalario/ingresos-egresos-areas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class HospitalarioController {

    private final IngresoEgresoService ingresoEgresoService;
    private final AreaService areaService;
    private final AccesoService accesoService;

    @GetMapping("/areas")
    public ResponseEntity<?> getAllAreas(HttpServletRequest request) {
        return ResponseEntity.ok(
                EntityResponse.success(
                        areaService.findAll(),
                        "Áreas obtenidas exitosamente",
                        request.getRequestURI()
                )
        );
    }

    @GetMapping("/areas/{id}")
    public ResponseEntity<?> getAreaById(@PathVariable Long id, HttpServletRequest request) {
        return ResponseEntity.ok(
                EntityResponse.success(
                        areaService.findById(id),
                        "Área obtenida exitosamente",
                        request.getRequestURI()
                )
        );
    }

    @PostMapping("/areas")
    public ResponseEntity<?> createArea(
            @Valid @RequestBody AreaRequestDTO request,
            HttpServletRequest httpRequest) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(
                        areaService.create(request, httpRequest),
                        "Área creada exitosamente",
                        httpRequest.getRequestURI()
                )
        );
    }

    @PutMapping("/areas/{id}")
    public ResponseEntity<?> updateArea(
            @PathVariable Long id,
            @Valid @RequestBody AreaRequestDTO request,
            HttpServletRequest httpRequest) {
       // accesoService.verificarRolPadre(RolesPadre.ADMIN);
        return ResponseEntity.ok(
                EntityResponse.success(
                        areaService.update(id, request, httpRequest),
                        "Área actualizada exitosamente",
                        httpRequest.getRequestURI()
                )
        );
    }

    @DeleteMapping("/areas/{id}")
    public ResponseEntity<?> deleteArea(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN);
        areaService.delete(id, httpRequest);
        return ResponseEntity.ok(
                EntityResponse.success(null, "Área eliminada exitosamente"));
    }


    @GetMapping("/ingresos")
    public ResponseEntity<?> getAllIngresos(HttpServletRequest request) {
        return ResponseEntity.ok(
                EntityResponse.success(
                        ingresoEgresoService.findAll(),
                        "Ingresos obtenidos exitosamente",
                        request.getRequestURI()
                        ));
    }

    @GetMapping("/ingresos/{id}")
    public ResponseEntity<?> getIngresoById(@PathVariable Long id, HttpServletRequest httpServletRequest) {
        return ResponseEntity.ok(
                EntityResponse.success(
                        ingresoEgresoService.findById(id),
                        "Ingreso obtenido exitosamente",
                        httpServletRequest.getRequestURI()
                )
        );
    }

    @GetMapping("/ingresos/area/{idArea}")
    public ResponseEntity<?> getInternadosByArea(@PathVariable Long idArea, HttpServletRequest request) {
        return ResponseEntity.ok(
                EntityResponse.success(
                        ingresoEgresoService.findInternadosByArea(idArea),
                        "Internados por área obtenidos exitosamente",
                        request.getRequestURI()
                ));
    }

    @GetMapping("/ingresos/paciente/{idPaciente}")
    public ResponseEntity<?> getIngresosByPaciente(@PathVariable Long idPaciente, HttpServletRequest request) {
        return ResponseEntity.ok(
                EntityResponse.success(
                        ingresoEgresoService.findByPaciente(idPaciente),
                        "Historial de ingresos obtenido exitosamente",
                        request.getRequestURI()
                ));
    }

    @PostMapping("/ingresos")
    public ResponseEntity<EntityResponse<IngresoEgresoResponseDTO>> registrarIngreso(
            @Valid @RequestBody IngresoRequestDTO request,
            HttpServletRequest httpRequest) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN, RolesPadre.USER);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                EntityResponse.success(
                        ingresoEgresoService.registrarIngreso(request, httpRequest),
                        "Ingreso registrado exitosamente",
                        httpRequest.getRequestURI()
                        )
        );
    }

    @PutMapping("/ingresos/{id}/egreso")
    public ResponseEntity<?> registrarEgreso(
            @PathVariable Long id,
            @Valid @RequestBody EgresoRequestDTO request,
            HttpServletRequest httpRequest) {
        //accesoService.verificarRolPadre(RolesPadre.ADMIN, RolesPadre.USER);
        return ResponseEntity.ok(
                EntityResponse.success(
                        ingresoEgresoService.registrarEgreso(id, request, httpRequest),
                        "Egreso registrado exitosamente",
                        httpRequest.getRequestURI()
                ));
    }

    @GetMapping("/ingresos/paginado")
    public ResponseEntity<?> getAllPaginated(    @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 HttpServletRequest request
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                EntityResponse.success(
                        ingresoEgresoService.findAll(pageable),
                        "Ingreso obtenido exitosamente",
                        request.getRequestURI()
                ));
    }
}
