package com.hospitaldb.backend.repository.medicamentos;

import com.hospitaldb.backend.entity.medicamentos.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMedicamentoRepository extends JpaRepository<Medicamento, Long> {

    List<Medicamento> findByNombreComercialContainingIgnoreCase(String nombreComercial);

    List<Medicamento> findByPrincipioActivoContainingIgnoreCase(String principioActivo);

    List<Medicamento> findByUnidadMedida(String unidadMedida);

    boolean existsByNombreComercial(String nombreComercial);

    @Query("SELECT m, COUNT(tm) FROM Medicamento m JOIN m.tratamientoMedicamentos tm GROUP BY m ORDER BY COUNT(tm) DESC")
    List<Object[]> findMedicamentosMasRecetados();

    @Query("SELECT m FROM Medicamento m JOIN m.inventarios i WHERE i.stockActual <= i.stockMinimo")
    List<Medicamento> findMedicamentosConStockBajo();

    @Query("SELECT m FROM Medicamento m WHERE SIZE(m.inventarios) = 0")
    List<Medicamento> findMedicamentosSinInventario();

    @Query("SELECT m FROM Medicamento m WHERE " +
            "LOWER(m.nombreComercial) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
            "LOWER(m.principioActivo) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Medicamento> searchMedicamentos(@Param("busqueda") String busqueda);
}
