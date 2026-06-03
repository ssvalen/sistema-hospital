package com.hospitaldb.backend.repository.hospitalario;

import com.hospitaldb.backend.entity.hospitalario.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAreaRepository extends JpaRepository<Area, Long> {
    boolean existsByNombreArea(String nombreArea);
}
