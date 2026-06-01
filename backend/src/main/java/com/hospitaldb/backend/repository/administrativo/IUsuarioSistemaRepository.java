package com.hospitaldb.backend.repository.administrativo;

import com.hospitaldb.backend.entity.administrativo.UsuarioSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioSistemaRepository extends JpaRepository<UsuarioSistema, Long> {

    Optional<UsuarioSistema> findByUsername(String username);

    Optional<UsuarioSistema> findByEmail(String email);

    Optional<UsuarioSistema> findByIdKeycloak(String idKeycloak);

    List<UsuarioSistema> findByActivoTrue();

    List<UsuarioSistema> findByActivoFalse();

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM UsuarioSistema u JOIN u.usuarioRoles ur WHERE ur.rol.nombreRol = :nombreRol")
    List<UsuarioSistema> findUsuariosByRolNombre(@Param("nombreRol") String nombreRol);

    List<UsuarioSistema> findByUsernameContainingIgnoreCase(String username);

    long countByActivoTrue();
}
