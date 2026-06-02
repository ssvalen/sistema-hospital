package com.hospitaldb.backend.repository.administrativo;

import com.hospitaldb.backend.entity.administrativo.UsuarioRol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRolRepository extends JpaRepository<UsuarioRol, Long> {

    List<UsuarioRol> findByUsuario_IdUsuario(Long idUsuario);

    List<UsuarioRol> findByRol_IdRol(Long idRol);

    List<UsuarioRol> findAllByActivo(boolean activo);

    Optional<UsuarioRol> findByUsuario_IdUsuarioAndRol_IdRol(Long idUsuario, Long idRol);

    @Modifying
    @Transactional
    void deleteByUsuario_IdUsuarioAndRol_IdRol(Long idUsuario, Long idRol);

    long countByRol_IdRol(Long idRol);

    boolean existsByUsuario_IdUsuarioAndRol_IdRol(Long idUsuario, Long idRol);

    @Query(" SELECT r.rolPadre.idRolPadre FROM UsuarioRol ur " +
        "JOIN ur.usuario u "+
        "JOIN ur.rol r "+
        "JOIN r.rolPadre rp "+
        "WHERE u.idKeycloak = :keycloakId ")
    List<Long> findIdRolesPadreByKeycloakId(String keycloakId);
}
