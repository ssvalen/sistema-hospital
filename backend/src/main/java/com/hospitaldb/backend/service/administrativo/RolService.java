package com.hospitaldb.backend.service.administrativo;

import com.hospitaldb.backend.dto.request.AsignacionPermisoRequestDTO;
import com.hospitaldb.backend.dto.request.RolRequestDTO;
import com.hospitaldb.backend.dto.response.administrativo.*;
import com.hospitaldb.backend.entity.administrativo.Permiso;
import com.hospitaldb.backend.entity.administrativo.Rol;
import com.hospitaldb.backend.entity.administrativo.RolPadre;
import com.hospitaldb.backend.entity.administrativo.RolPermiso;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.administrativo.IPermisoRepository;
import com.hospitaldb.backend.repository.administrativo.IRolPadreRepository;
import com.hospitaldb.backend.repository.administrativo.IRolPermisoRepository;
import com.hospitaldb.backend.repository.administrativo.IRolRepository;
import com.hospitaldb.backend.service.keycloak.KeycloakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RolService {
    private final IRolRepository rolRepository;
    private final IPermisoRepository permisoRepository;
    private final IRolPermisoRepository rolPermisoRepository;
    private final IRolPadreRepository rolPadreRepository;

    private final KeycloakService keycloakService;

    private final ModelMapper modelMapper;

    public List<RolJoinDTO> findAll() {
        log.info("Obteniendo todos los roles");

        List<Rol> roles = rolRepository.findAllByActivo(true);

        return roles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RolPadreDTO> findAllRolPadre() {
        List<RolPadre> roles = rolPadreRepository.findAll();
        return roles.stream()
                .map(rol -> modelMapper.map(rol, RolPadreDTO.class))
                .collect(Collectors.toList());
    }

    public Page<RolJoinDTO> findAll(Pageable pageable) {
        log.info("Obteniendo roles paginados");
        Page<Rol> pageResult = rolRepository.findAllByActivo(true, pageable);
        return pageResult.map(this::convertToDTO);
    }

    public RolJoinDTO findById(Long id) {
        log.info("Buscando rol con ID: {}", id);

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + id));

        return convertToDTO(rol);
    }

    public RolDTO findByNombre(String nombreRol) {
        log.info("Buscando rol por nombre: {}", nombreRol);
        Rol rol = rolRepository.findByNombreRol(nombreRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con nombre: " + nombreRol));
        return modelMapper.map(rol, RolDTO.class);
    }

    @Transactional
    public RolDTO create(RolRequestDTO request) {
        log.info("Creando nuevo rol basado en rol padre id: {}",
                request.getModelRoleId());

        RolPadre rolPadre = rolPadreRepository.findById(request.getModelRoleId())
                .orElseThrow(() -> new BusinessException("No existe el rol padre con id: " + request.getModelRoleId()));

        if (rolRepository.existsByNombreRol(request.getNombreRol())) {
            throw new BusinessException("Ya existe un rol con el nombre: " + request.getNombreRol());
        }

        Rol rol = new Rol();
        rol.setNombreRol(request.getNombreRol());
        rol.setRolPadre(rolPadre);

        Rol saved = rolRepository.save(rol);
        log.info("Rol creado exitosamente con ID: {}", saved.getIdRol());

        if (request.getPermissions() != null && !request.getPermissions().isEmpty()) {
            guardarPermisosUI(saved, request.getPermissions());
        }
        keycloakService.createRealmRole(request.getNombreRol()).block();
        return modelMapper.map(saved, RolDTO.class);
    }

    private void guardarPermisosUI(Rol rol, List<BigInteger> permisos) {
        permisos.forEach(nombrePermiso -> {
            Permiso permiso = permisoRepository
                    .findByIdPermiso(nombrePermiso)
                    .orElseGet(() -> {
                        Permiso nuevo = new Permiso();
                        nuevo.setIdPermiso(nombrePermiso.longValue());
                        return permisoRepository.save(nuevo);
                    });

            if (!rolPermisoRepository.existsByRolAndPermiso(rol, permiso)) {
                RolPermiso rolPermiso = new RolPermiso();
                rolPermiso.setRol(rol);
                rolPermiso.setPermiso(permiso);
                rolPermisoRepository.save(rolPermiso);
            }
        });
        log.info("Guardados {} permisos UI para rol {}",
                permisos.size(), rol.getNombreRol());
    }

    @Transactional
    public RolDTO update(Long id, RolRequestDTO request) {

        log.info("Actualizando rol con ID: {}", id);

        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Rol no encontrado con ID: " + id));

        if (!rol.getNombreRol().equals(request.getNombreRol())
                && rolRepository.existsByNombreRol(request.getNombreRol())) {

            throw new BusinessException(
                    "Ya existe un rol con el nombre: "
                            + request.getNombreRol());
        }

        RolPadre rolPadre = rolPadreRepository
                .findById(request.getModelRoleId())
                .orElseThrow(() -> new BusinessException(
                        "No existe el rol padre con id: "
                                + request.getModelRoleId()));

        rol.setNombreRol(request.getNombreRol());
        rol.setRolPadre(rolPadre);

        Rol updated = rolRepository.save(rol);

        rolPermisoRepository.deleteByRol_IdRol(id);

        if (request.getPermissions() != null
                && !request.getPermissions().isEmpty()) {

            guardarPermisosUI(
                    updated,
                    request.getPermissions());
        }

        log.info("Rol actualizado exitosamente: {}", id);

        return modelMapper.map(updated, RolDTO.class);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando rol con ID: {}", id);
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + id));

        if (!rol.getUsuarioRoles().isEmpty()) {
            throw new BusinessException("No se puede eliminar un rol que tiene usuarios asignados");
        }

        if (!rol.getRolPermisos().isEmpty()) {
            throw new BusinessException("No se puede eliminar un rol que tiene permisos asignados");
        }

        rol.setActivo(false);
        rolRepository.save(rol);
        log.info("Rol eliminado exitosamente: {}", id);
    }

    @Transactional
    public List<RolPermisoDTO> asignarPermisos(AsignacionPermisoRequestDTO request) {
        log.info("Asignando {} permisos al rol {}", request.getIdPermisos().size(), request.getIdRol());

        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + request.getIdRol()));

        List<Permiso> permisos = new ArrayList<>();
        for (Long idPermiso : request.getIdPermisos()) {
            Permiso permiso = permisoRepository.findById(idPermiso)
                    .orElseThrow(() -> new ResourceNotFoundException("Permiso no encontrado con ID: " + idPermiso));
            permisos.add(permiso);
        }

        List<Long> existingPermisoIds = rolPermisoRepository.findExistingPermisoIds(request.getIdRol(),
                request.getIdPermisos());

        if (!existingPermisoIds.isEmpty()) {
            log.warn("Los permisos {} ya están asignados al rol {}", existingPermisoIds, request.getIdRol());
            throw new BusinessException(
                    "Los permisos con IDs " + existingPermisoIds + " ya están asignados a este rol");
        }

        List<RolPermisoDTO> resultados = new ArrayList<>();
        for (Permiso permiso : permisos) {
            RolPermiso rolPermiso = new RolPermiso();
            rolPermiso.setRol(rol);
            rolPermiso.setPermiso(permiso);

            RolPermiso saved = rolPermisoRepository.save(rolPermiso);

            resultados.add(RolPermisoDTO.builder()
                    .id(saved.getId())
                    .idRol(rol.getIdRol())
                    .nombreRol(rol.getNombreRol())
                    .idPermiso(permiso.getIdPermiso())
                    .nombrePermiso(permiso.getNombrePermiso())
                    .build());
        }

        log.info("Permisos asignados exitosamente. Total: {}", resultados.size());
        return resultados;
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

    @Transactional
    public void removerPermisos(Long idRol, List<Long> idPermisos) {
        log.info("Removiendo {} permisos del rol {}", idPermisos.size(), idRol);

        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + idRol));

        if (idPermisos == null || idPermisos.isEmpty()) {
            throw new BusinessException("La lista de permisos a remover no puede estar vacía");
        }

        for (Long idPermiso : idPermisos) {
            if (!permisoRepository.existsById(idPermiso)) {
                throw new ResourceNotFoundException("Permiso no encontrado con ID: " + idPermiso);
            }
        }

        long countAsignados = rolPermisoRepository.countByRol_IdRolAndPermiso_IdPermisoIn(idRol, idPermisos);

        if (countAsignados == 0) {
            throw new BusinessException("Ninguno de los permisos especificados está asignado a este rol");
        }

        if (countAsignados < idPermisos.size()) {
            log.warn("Solo {} de {} permisos están asignados al rol {}", countAsignados, idPermisos.size(), idRol);
        }

        rolPermisoRepository.deleteByRol_IdRolAndPermiso_IdPermisoIn(idRol, idPermisos);
        log.info("Permisos removidos exitosamente del rol {}", idRol);
    }

    public List<PermisoDTO> findPermisosByRol(Long idRol) {
        log.info("Buscando permisos del rol: {}", idRol);

        rolRepository.findById(idRol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + idRol));

        List<Permiso> permisos = permisoRepository.findPermisosByRolId(idRol);

        return permisos.stream()
                .map(permiso -> modelMapper.map(permiso, PermisoDTO.class))
                .collect(Collectors.toList());
    }

    private RolJoinDTO convertToDTO(Rol rol) {
        RolJoinDTO rolDTO = RolJoinDTO.builder()
                .idRol(rol.getIdRol())
                .nombreRol(rol.getNombreRol())
                .build();

        if (rol.getRolPadre() != null) {
            if (rol.getRolPadre() != null) {
                RolPadreDTO rolPadreDTO = RolPadreDTO.builder()
                        .idRolPadre(rol.getRolPadre().getIdRolPadre())
                        .nombreRolPadre(rol.getRolPadre().getNombreRolPadre())
                        .build();

                rolDTO.setRolPadre(rolPadreDTO);
            }

        }

        List<PermisoDTO> permisos = permisoRepository.findPermisosByRolId(rol.getIdRol())
                .stream()
                .map(permiso -> PermisoDTO.builder()
                        .idPermiso(permiso.getIdPermiso())
                        .nombrePermiso(permiso.getNombrePermiso())
                        .build())
                .collect(Collectors.toList());
        rolDTO.setPermisos(permisos);

        return rolDTO;
    }
}
