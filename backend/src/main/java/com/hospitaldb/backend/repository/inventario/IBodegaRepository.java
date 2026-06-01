package com.hospitaldb.backend.repository.inventario;

import com.hospitaldb.backend.entity.inventario.Bodega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IBodegaRepository extends JpaRepository<Bodega, Long> {

    Optional<Bodega> findByNombreBodega(String nombreBodega);

    List<Bodega> findByUbicacionContainingIgnoreCase(String ubicacion);

    @Query("SELECT b FROM Bodega b WHERE SIZE(b.inventarios) > 0")
    List<Bodega> findBodegasConInventario();

    @Query("SELECT b FROM Bodega b WHERE SIZE(b.inventarios) = 0")
    List<Bodega> findBodegasSinInventario();

    boolean existsByNombreBodega(String nombreBodega);
}
