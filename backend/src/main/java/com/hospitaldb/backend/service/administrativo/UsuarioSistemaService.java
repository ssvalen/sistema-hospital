package com.hospitaldb.backend.service.administrativo;

import com.hospitaldb.backend.dto.request.AsignacionRolRequestDTO;
import com.hospitaldb.backend.dto.request.KeycloakUserRequestDTO;
import com.hospitaldb.backend.dto.request.UsuarioSistemaRequestDTO;
import com.hospitaldb.backend.dto.response.administrativo.RolDTO;
import com.hospitaldb.backend.dto.response.administrativo.UsuarioSistemaDetailDTO;
import com.hospitaldb.backend.dto.response.administrativo.UsuarioSistemaListDTO;
import com.hospitaldb.backend.entity.administrativo.Rol;
import com.hospitaldb.backend.entity.administrativo.UsuarioRol;
import com.hospitaldb.backend.entity.administrativo.UsuarioSistema;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.administrativo.IRolRepository;
import com.hospitaldb.backend.repository.administrativo.IUsuarioRolRepository;
import com.hospitaldb.backend.repository.administrativo.IUsuarioSistemaRepository;
import com.hospitaldb.backend.service.keycloak.KeycloakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.StringEncryptor;
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
public class UsuarioSistemaService {
    private final IUsuarioSistemaRepository usuarioRepository;

    private final IRolRepository rolRepository;

    private final IUsuarioRolRepository usuarioRolRepository;

    private final StringEncryptor stringEncryptor;

    private final KeycloakService keycloakAdminService;

    private final ModelMapper modelMapper;

    public List<UsuarioSistemaListDTO> findAll() {
        log.info("Obteniendo todos los usuarios del sistema");
        List<UsuarioSistema> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioSistemaListDTO.class))
                .collect(Collectors.toList());
    }

    public Page<UsuarioSistemaListDTO> findAll(Pageable pageable) {
        log.info("Obteniendo usuarios paginados");
        Page<UsuarioSistema> pageResult = usuarioRepository.findAll(pageable);
        return pageResult.map(usuario -> modelMapper.map(usuario, UsuarioSistemaListDTO.class));
    }

    public UsuarioSistemaDetailDTO findById(Long id) {
        log.info("Buscando usuario con ID: {}", id);
        UsuarioSistema usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        return buildUsuarioDetailDTO(usuario);
    }

    public UsuarioSistemaDetailDTO findByUsername(String username) {
        log.info("Buscando usuario por username: {}", username);
        UsuarioSistema usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con username: " + username));

        return buildUsuarioDetailDTO(usuario);
    }

    public UsuarioSistemaDetailDTO findByEmail(String email) {
        log.info("Buscando usuario por email: {}", email);
        UsuarioSistema usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));

        return buildUsuarioDetailDTO(usuario);
    }

    @Transactional
    public UsuarioSistemaDetailDTO create(UsuarioSistemaRequestDTO request) {
        log.info("Creando nuevo usuario: {}", request.getUsername());

        if (usuarioRepository.existsByUsername(request.getUsername())) 
            throw new BusinessException("Ya existe un usuario con el username: " + request.getUsername());


        if (usuarioRepository.existsByEmail(request.getEmail()))
            throw new BusinessException("Ya existe un usuario con el email: " + request.getEmail());

        keycloakAdminService.createUser(buildKeycloakUserRequest(request)).block();
        String keycloakId = keycloakAdminService.getUserId(request.getUsername());

        if(keycloakId.isBlank())
            throw new ResourceNotFoundException("Usuario no encontrado en Keycloak, verifique los logs");

        UsuarioSistema usuario = new UsuarioSistema();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setActivo(request.getActivo() != null ? request.getActivo() : true);
        usuario.setIdKeycloak(keycloakId);

        UsuarioSistema saved = usuarioRepository.save(usuario);

        if (request.getRealmRoles() != null && !request.getRealmRoles().isEmpty()) {
            for (String roleName : request.getRealmRoles()) {
                Rol rol = rolRepository.findByNombreRol(roleName)
                        .orElseThrow(() -> new BusinessException("Rol no encontrado: " + roleName));

                UsuarioRol usuarioRol = new UsuarioRol();
                usuarioRol.setUsuario(saved);
                usuarioRol.setRol(rol);
                usuarioRolRepository.save(usuarioRol);
            }
        }
        log.info("Usuario creado exitosamente con ID: {}", saved.getIdUsuario());

        return buildUsuarioDetailDTO(saved);
    }

    private KeycloakUserRequestDTO buildKeycloakUserRequest(UsuarioSistemaRequestDTO user){
        return KeycloakUserRequestDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .enabled(user.getActivo())
                .build();
    }

    @Transactional
    public UsuarioSistemaDetailDTO update(Long id, UsuarioSistemaRequestDTO request) {
        log.info("Actualizando usuario con ID: {}", id);

        UsuarioSistema usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        if (!usuario.getUsername().equals(request.getUsername()) &&
                usuarioRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Ya existe un usuario con el username: " + request.getUsername());
        }

        if (!usuario.getEmail().equals(request.getEmail()) &&
                usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe un usuario con el email: " + request.getEmail());
        }

        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());

        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }

        if (request.getIdKeycloak() != null) {
            usuario.setIdKeycloak(request.getIdKeycloak());
        }

        UsuarioSistema updated = usuarioRepository.save(usuario);
        log.info("Usuario actualizado exitosamente: {}", id);
        return buildUsuarioDetailDTO(updated);
    }


    @Transactional
    public void delete(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        UsuarioSistema usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        // Eliminar de Keycloak
        if (usuario.getIdKeycloak() != null) {
            //keycloakAdminService.deleteKeycloakUser(usuario.getIdKeycloak());
        }

        // Eliminar relaciones locales
        if (!usuario.getUsuarioRoles().isEmpty()) {
            usuarioRolRepository.deleteByUsuario_IdUsuarioAndRol_IdRol(id, null);
        }

        usuarioRepository.delete(usuario);
        log.info("Usuario eliminado exitosamente: {}", id);
    }

    @Transactional
    public UsuarioRol asignarRol(AsignacionRolRequestDTO request) {
        log.info("Asignando rol {} al usuario {}", request.getIdRol(), request.getIdUsuario());

        UsuarioSistema usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + request.getIdUsuario()));

        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + request.getIdRol()));

        if (usuarioRolRepository.existsByUsuario_IdUsuarioAndRol_IdRol(request.getIdUsuario(), request.getIdRol())) {
            throw new BusinessException("El usuario ya tiene asignado este rol");
        }

        UsuarioRol usuarioRol = new UsuarioRol();
        usuarioRol.setUsuario(usuario);
        usuarioRol.setRol(rol);

        UsuarioRol saved = usuarioRolRepository.save(usuarioRol);
        log.info("Rol asignado exitosamente");

        // También asignar rol en Keycloak
        if (usuario.getIdKeycloak() != null) {
           // keycloakAdminService.assignRoleToUser(usuario.getIdKeycloak(), rol.getNombreRol());
        }

        return saved;
    }

    @Transactional
    public void removerRol(Long idUsuario, Long idRol) {
        log.info("Removiendo rol {} del usuario {}", idRol, idUsuario);

        if (!usuarioRolRepository.existsByUsuario_IdUsuarioAndRol_IdRol(idUsuario, idRol)) {
            throw new BusinessException("El usuario no tiene asignado este rol");
        }

        usuarioRolRepository.deleteByUsuario_IdUsuarioAndRol_IdRol(idUsuario, idRol);
        log.info("Rol removido exitosamente");
    }

    public List<RolDTO> findRolesByUsuario(Long idUsuario) {
        log.info("Buscando roles del usuario: {}", idUsuario);

        usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + idUsuario));

        List<Rol> roles = rolRepository.findRolesByUsuarioId(idUsuario);

        return roles.stream()
                .map(rol -> modelMapper.map(rol, RolDTO.class))
                .collect(Collectors.toList());
    }

    public List<UsuarioSistemaListDTO> findUsuariosActivos() {
        log.info("Buscando usuarios activos");
        List<UsuarioSistema> usuarios = usuarioRepository.findByActivoTrue();
        return usuarios.stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioSistemaListDTO.class))
                .collect(Collectors.toList());
    }

    public List<UsuarioSistemaListDTO> findUsuariosByRol(String nombreRol) {
        log.info("Buscando usuarios con rol: {}", nombreRol);
        List<UsuarioSistema> usuarios = usuarioRepository.findUsuariosByRolNombre(nombreRol);
        return usuarios.stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioSistemaListDTO.class))
                .collect(Collectors.toList());
    }

    private UsuarioSistemaDetailDTO buildUsuarioDetailDTO(UsuarioSistema usuario) {
        List<RolDTO> roles = rolRepository.findRolesByUsuarioId(usuario.getIdUsuario()).stream()
                .map(rol -> modelMapper.map(rol, RolDTO.class))
                .collect(Collectors.toList());

        return UsuarioSistemaDetailDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .activo(usuario.getActivo())
                .idKeycloak(usuario.getIdKeycloak())
                .roles(roles)
                .build();
    }
}
