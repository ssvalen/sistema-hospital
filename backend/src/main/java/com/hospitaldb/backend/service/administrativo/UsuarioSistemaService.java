package com.hospitaldb.backend.service.administrativo;

import com.hospitaldb.backend.dto.request.AsignacionRolRequestDTO;
import com.hospitaldb.backend.dto.request.UsuarioSistemaRequestDTO;
import com.hospitaldb.backend.entity.administrativo.Rol;
import com.hospitaldb.backend.entity.administrativo.UsuarioRol;
import com.hospitaldb.backend.entity.administrativo.UsuarioSistema;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.administrativo.IRolRepository;
import com.hospitaldb.backend.repository.administrativo.IUsuarioRolRepository;
import com.hospitaldb.backend.repository.administrativo.IUsuarioSistemaRepository;
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
public class UsuarioSistemaService {
    private final IUsuarioSistemaRepository usuarioRepository;
    private final IRolRepository rolRepository;
    private final IUsuarioRolRepository usuarioRolRepository;

    public List<UsuarioSistema> findAll() {
        log.info("Obteniendo todos los usuarios del sistema");
        return usuarioRepository.findAll();
    }

    public Page<UsuarioSistema> findAll(Pageable pageable) {
        log.info("Obteniendo usuarios paginados");
        return usuarioRepository.findAll(pageable);
    }

    public UsuarioSistema findById(Long id) {
        log.info("Buscando usuario con ID: {}", id);
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    public UsuarioSistema findByUsername(String username) {
        log.info("Buscando usuario por username: {}", username);
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con username: " + username));
    }

    public UsuarioSistema findByEmail(String email) {
        log.info("Buscando usuario por email: {}", email);
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
    }

    @Transactional
    public UsuarioSistema create(UsuarioSistemaRequestDTO request) {
        log.info("Creando nuevo usuario: {}", request.getUsername());

        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Ya existe un usuario con el username: " + request.getUsername());
        }

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe un usuario con el email: " + request.getEmail());
        }

        UsuarioSistema usuario = new UsuarioSistema();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setActivo(request.getActivo() != null ? request.getActivo() : true);
        usuario.setIdKeycloak(request.getIdKeycloak());

        UsuarioSistema saved = usuarioRepository.save(usuario);
        log.info("Usuario creado exitosamente con ID: {}", saved.getIdUsuario());
        return saved;
    }

    @Transactional
    public UsuarioSistema update(Long id, UsuarioSistemaRequestDTO request) {
        log.info("Actualizando usuario con ID: {}", id);

        UsuarioSistema usuario = findById(id);

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
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando usuario con ID: {}", id);
        UsuarioSistema usuario = findById(id);

        if (!usuario.getUsuarioRoles().isEmpty()) {
            usuarioRolRepository.deleteByUsuario_IdUsuarioAndRol_IdRol(id, null);
        }

        usuarioRepository.delete(usuario);
        log.info("Usuario eliminado exitosamente: {}", id);
    }

    @Transactional
    public UsuarioRol asignarRol(AsignacionRolRequestDTO request) {
        log.info("Asignando rol {} al usuario {}", request.getIdRol(), request.getIdUsuario());

        UsuarioSistema usuario = findById(request.getIdUsuario());
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

    public List<Rol> findRolesByUsuario(Long idUsuario) {
        log.info("Buscando roles del usuario: {}", idUsuario);
        return rolRepository.findRolesByUsuarioId(idUsuario);
    }

    public List<UsuarioSistema> findUsuariosActivos() {
        log.info("Buscando usuarios activos");
        return usuarioRepository.findByActivoTrue();
    }

    public List<UsuarioSistema> findUsuariosByRol(String nombreRol) {
        log.info("Buscando usuarios con rol: {}", nombreRol);
        return usuarioRepository.findUsuariosByRolNombre(nombreRol);
    }
}
