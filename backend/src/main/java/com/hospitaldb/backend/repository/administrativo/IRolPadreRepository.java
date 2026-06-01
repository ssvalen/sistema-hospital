package com.hospitaldb.backend.repository.administrativo;

import com.hospitaldb.backend.entity.administrativo.Permiso;
import com.hospitaldb.backend.entity.administrativo.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IRolPadreRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombreRol(String nombreRol);

    boolean existsByNombreRol(String nombreRol);
}