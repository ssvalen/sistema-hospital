package com.hospitaldb.backend.repository.administrativo;

import com.hospitaldb.backend.entity.administrativo.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IRolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombreRol(String nombreRol);

    boolean existsByNombreRol(String nombreRol);

    @Query("SELECT r FROM Rol r JOIN r.usuarioRoles ur WHERE ur.usuario.idUsuario = :idUsuario")
    List<Rol> findRolesByUsuarioId(@Param("idUsuario") Long idUsuario);

    @Query("SELECT r FROM Rol r JOIN r.rolPermisos rp WHERE rp.permiso.nombrePermiso = :nombrePermiso")
    List<Rol> findRolesByPermisoNombre(@Param("nombrePermiso") String nombrePermiso);

    List<Rol> findByNombreRolContainingIgnoreCase(String nombreRol);
}