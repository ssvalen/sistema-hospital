package com.hospitaldb.backend.repository.administrativo;

import com.hospitaldb.backend.entity.administrativo.RolPermiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface IRolPermisoRepository extends JpaRepository<RolPermiso, Long> {

    List<RolPermiso> findByRol_IdRol(Long idRol);

    List<RolPermiso> findByPermiso_IdPermiso(Long idPermiso);

    Optional<RolPermiso> findByRol_IdRolAndPermiso_IdPermiso(Long idRol, Long idPermiso);

    boolean existsByRol_IdRolAndPermiso_IdPermiso(Long idRol, Long idPermiso);

    @Modifying
    @Transactional
    void deleteByRol_IdRolAndPermiso_IdPermiso(Long idRol, Long idPermiso);

    long countByRol_IdRol(Long idRol);
}
