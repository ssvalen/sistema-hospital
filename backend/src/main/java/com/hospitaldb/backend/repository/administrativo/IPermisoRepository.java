package com.hospitaldb.backend.repository.administrativo;

import com.hospitaldb.backend.entity.administrativo.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPermisoRepository extends JpaRepository<Permiso, Long> {

    Optional<Permiso> findByNombrePermiso(String nombrePermiso);

    boolean existsByNombrePermiso(String nombrePermiso);

    @Query("SELECT p FROM Permiso p JOIN p.rolPermisos rp WHERE rp.rol.idRol = :idRol")
    List<Permiso> findPermisosByRolId(@Param("idRol") Long idRol);

    @Query("SELECT DISTINCT p FROM Permiso p " +
            "JOIN p.rolPermisos rp " +
            "JOIN rp.rol r " +
            "JOIN r.usuarioRoles ur " +
            "WHERE ur.usuario.idUsuario = :idUsuario")
    List<Permiso> findPermisosByUsuarioId(@Param("idUsuario") Long idUsuario);

    List<Permiso> findByNombrePermisoContainingIgnoreCase(String nombrePermiso);

}