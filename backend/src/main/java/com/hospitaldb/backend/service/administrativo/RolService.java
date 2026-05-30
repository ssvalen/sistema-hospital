package com.hospitaldb.backend.service.administrativo;

import com.hospitaldb.backend.dto.request.AsignacionPermisoRequestDTO;
import com.hospitaldb.backend.dto.request.RolRequestDTO;
import com.hospitaldb.backend.entity.administrativo.Permiso;
import com.hospitaldb.backend.entity.administrativo.Rol;
import com.hospitaldb.backend.entity.administrativo.RolPermiso;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.administrativo.IPermisoRepository;
import com.hospitaldb.backend.repository.administrativo.IRolPermisoRepository;
import com.hospitaldb.backend.repository.administrativo.IRolRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RolService {
    private final IRolRepository rolRepository;
    private final IPermisoRepository permisoRepository;
    private final IRolPermisoRepository rolPermisoRepository;

    public List<Rol> findAll() {
        log.info("Obteniendo todos los roles");
        return rolRepository.findAll();
    }

    public Page<Rol> findAll(Pageable pageable) {
        log.info("Obteniendo roles paginados");
        return rolRepository.findAll(pageable);
    }

    public Rol findById(Long id) {
        log.info("Buscando rol con ID: {}", id);
        return rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + id));
    }

    public Rol findByNombre(String nombreRol) {
        log.info("Buscando rol por nombre: {}", nombreRol);
        return rolRepository.findByNombreRol(nombreRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con nombre: " + nombreRol));
    }

    @Transactional
    public Rol create(RolRequestDTO request) {
        log.info("Creando nuevo rol: {}", request.getNombreRol());

        if (rolRepository.existsByNombreRol(request.getNombreRol())) {
            throw new BusinessException("Ya existe un rol con el nombre: " + request.getNombreRol());
        }

        Rol rol = new Rol();
        rol.setNombreRol(request.getNombreRol());

        Rol saved = rolRepository.save(rol);
        log.info("Rol creado exitosamente con ID: {}", saved.getIdRol());
        return saved;
    }

    @Transactional
    public Rol update(Long id, RolRequestDTO request) {
        log.info("Actualizando rol con ID: {}", id);

        Rol rol = findById(id);

        if (!rol.getNombreRol().equals(request.getNombreRol()) &&
                rolRepository.existsByNombreRol(request.getNombreRol())) {
            throw new BusinessException("Ya existe un rol con el nombre: " + request.getNombreRol());
        }

        rol.setNombreRol(request.getNombreRol());

        Rol updated = rolRepository.save(rol);
        log.info("Rol actualizado exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando rol con ID: {}", id);
        Rol rol = findById(id);

        if (!rol.getUsuarioRoles().isEmpty()) {
            throw new BusinessException("No se puede eliminar un rol que tiene usuarios asignados");
        }

        if (!rol.getRolPermisos().isEmpty()) {
            throw new BusinessException("No se puede eliminar un rol que tiene permisos asignados");
        }

        rolRepository.delete(rol);
        log.info("Rol eliminado exitosamente: {}", id);
    }

    @Transactional
    public RolPermiso asignarPermiso(AsignacionPermisoRequestDTO request) {
        log.info("Asignando permiso {} al rol {}", request.getIdPermiso(), request.getIdRol());

        Rol rol = findById(request.getIdRol());
        Permiso permiso = permisoRepository.findById(request.getIdPermiso())
                .orElseThrow(() -> new ResourceNotFoundException("Permiso no encontrado con ID: " + request.getIdPermiso()));

        if (rolPermisoRepository.existsByRol_IdRolAndPermiso_IdPermiso(request.getIdRol(), request.getIdPermiso())) {
            throw new BusinessException("El rol ya tiene asignado este permiso");
        }

        RolPermiso rolPermiso = new RolPermiso();
        rolPermiso.setRol(rol);
        rolPermiso.setPermiso(permiso);

        RolPermiso saved = rolPermisoRepository.save(rolPermiso);
        log.info("Permiso asignado exitosamente");
        return saved;
    }

    @Transactional
    public void removerPermiso(Long idRol, Long idPermiso) {
        log.info("Removiendo permiso {} del rol {}", idPermiso, idRol);

        if (!rolPermisoRepository.existsByRol_IdRolAndPermiso_IdPermiso(idRol, idPermiso)) {
            throw new BusinessException("El rol no tiene asignado este permiso");
        }

        rolPermisoRepository.deleteByRol_IdRolAndPermiso_IdPermiso(idRol, idPermiso);
        log.info("Permiso removido exitosamente");
    }

    public List<Permiso> findPermisosByRol(Long idRol) {
        log.info("Buscando permisos del rol: {}", idRol);
        return permisoRepository.findPermisosByRolId(idRol);
    }
}
