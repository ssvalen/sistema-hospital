package com.hospitaldb.backend.service.administrativo;

import com.hospitaldb.backend.dto.request.PermisoRequestDTO;
import com.hospitaldb.backend.dto.response.administrativo.PermisoDTO;
import com.hospitaldb.backend.entity.administrativo.Permiso;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.administrativo.IPermisoRepository;
import com.hospitaldb.backend.service.auditoria.AuditService;
import com.hospitaldb.backend.utils.AuditAction;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PermisoService {

    private final IPermisoRepository permisoRepository;
    private final ModelMapper modelMapper;
    private final AuditService auditService;

    public List<PermisoDTO> findAll() {
        log.info("Obteniendo todos los permisos");

        List<Permiso> permisos = permisoRepository.findAllByActivo(true);

        return permisos.stream()
                .map(permiso -> modelMapper.map(permiso, PermisoDTO.class))
                .collect(Collectors.toList());
    }

    public Page<PermisoDTO> findAll(Pageable pageable) {
        log.info("Obteniendo permisos paginados");

        Page<Permiso> pageResult = permisoRepository.findAllByActivo(true, pageable);

        return pageResult.map(permiso -> modelMapper.map(permiso, PermisoDTO.class));
    }

    public PermisoDTO findById(Long id) {
        log.info("Buscando permiso con ID: {}", id);

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permiso no encontrado con ID: " + id));

        return modelMapper.map(permiso, PermisoDTO.class);
    }

    public PermisoDTO findByNombre(String nombrePermiso) {
        log.info("Buscando permiso por nombre: {}", nombrePermiso);

        Permiso permiso = permisoRepository.findByNombrePermiso(nombrePermiso)
                .orElseThrow(() -> new ResourceNotFoundException("Permiso no encontrado con nombre: " + nombrePermiso));

        return modelMapper.map(permiso, PermisoDTO.class);
    }

    @Transactional
    public PermisoDTO create(PermisoRequestDTO request, HttpServletRequest httpRequest) {

        log.info("Creando nuevo permiso: {}", request.getNombrePermiso());

        if (permisoRepository.existsByNombrePermiso(request.getNombrePermiso())) {
            throw new BusinessException("Ya existe un permiso con el nombre: " + request.getNombrePermiso());
        }

        Permiso permiso = new Permiso();
        permiso.setNombrePermiso(request.getNombrePermiso());

        Permiso saved = permisoRepository.save(permiso);

        auditService.log(
                AuditAction.CREATE,
                "Permiso",
                String.valueOf(saved.getIdPermiso()),
                null,
                modelMapper.map(saved, PermisoDTO.class),
                null,
                httpRequest);

        log.info("Permiso creado exitosamente con ID: {}", saved.getIdPermiso());

        return modelMapper.map(saved, PermisoDTO.class);
    }

    @Transactional
    public PermisoDTO update(Long id, PermisoRequestDTO request, HttpServletRequest httpRequest) {

        log.info("Actualizando permiso con ID: {}", id);

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permiso no encontrado con ID: " + id));

        PermisoDTO beforeAudit = modelMapper.map(permiso, PermisoDTO.class);

        if (!permiso.getNombrePermiso().equals(request.getNombrePermiso()) &&
                permisoRepository.existsByNombrePermiso(request.getNombrePermiso())) {
            throw new BusinessException("Ya existe un permiso con el nombre: " + request.getNombrePermiso());
        }

        permiso.setNombrePermiso(request.getNombrePermiso());

        Permiso updated = permisoRepository.save(permiso);

        auditService.log(
                AuditAction.UPDATE,
                "Permiso",
                String.valueOf(updated.getIdPermiso()),
                beforeAudit,
                modelMapper.map(updated, PermisoDTO.class),
                null,
                httpRequest);

        log.info("Permiso actualizado exitosamente: {}", id);

        return modelMapper.map(updated, PermisoDTO.class);
    }

    @Transactional
    public void delete(Long id, HttpServletRequest httpRequest) {

        log.info("Eliminando permiso con ID: {}", id);

        Permiso permiso = permisoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permiso no encontrado con ID: " + id));

        PermisoDTO beforeAudit = modelMapper.map(permiso, PermisoDTO.class);

        if (!permiso.getRolPermisos().isEmpty()) {
            throw new BusinessException("No se puede eliminar un permiso que está asignado a roles");
        }

        permiso.setActivo(false);
        permisoRepository.save(permiso);

        auditService.log(
                AuditAction.DELETE,
                "Permiso",
                String.valueOf(id),
                beforeAudit,
                null,
                null,
                httpRequest);

        log.info("Permiso eliminado exitosamente: {}", id);
    }

    public List<PermisoDTO> findPermisosByUsuario(Long idUsuario) {
        log.info("Buscando permisos del usuario: {}", idUsuario);

        List<Permiso> permisos = permisoRepository.findPermisosByUsuarioId(idUsuario);

        return permisos.stream()
                .map(permiso -> modelMapper.map(permiso, PermisoDTO.class))
                .collect(Collectors.toList());
    }

    public List<PermisoDTO> findPermisosByIdKeycloak(String idKeycloak) {

        log.info("Buscando permisos para idKeycloak: {}", idKeycloak);

        List<Permiso> permisos = permisoRepository.findPermisosByIdKeycloak(idKeycloak);

        return permisos.stream()
                .map(permiso -> modelMapper.map(permiso, PermisoDTO.class))
                .toList();
    }

}