package com.hospitaldb.backend.repository.inventario;

import com.hospitaldb.backend.entity.inventario.InventarioMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface IInventarioMedicamentoRepository extends JpaRepository<InventarioMedicamento, Long> {

    List<InventarioMedicamento> findByMedicamento_IdMedicamento(Long idMedicamento);

    List<InventarioMedicamento> findByBodega_IdBodega(Long idBodega);

    Optional<InventarioMedicamento> findByMedicamento_IdMedicamentoAndBodega_IdBodega(Long idMedicamento, Long idBodega);

    @Query("SELECT i FROM InventarioMedicamento i WHERE i.stockActual <= i.stockMinimo")
    List<InventarioMedicamento> findProductosConStockBajo();

    @Query("SELECT i FROM InventarioMedicamento i WHERE i.stockActual = 0")
    List<InventarioMedicamento> findProductosSinStock();

    @Modifying
    @Transactional
    @Query("UPDATE InventarioMedicamento i SET i.stockActual = :nuevoStock WHERE i.idInventario = :idInventario")
    void updateStock(@Param("idInventario") Long idInventario, @Param("nuevoStock") Integer nuevoStock);

    @Modifying
    @Transactional
    @Query("UPDATE InventarioMedicamento i SET i.stockActual = i.stockActual - :cantidad " +
            "WHERE i.medicamento.idMedicamento = :idMedicamento AND i.bodega.idBodega = :idBodega " +
            "AND i.stockActual >= :cantidad")
    int descontarStock(@Param("idMedicamento") Long idMedicamento,
                       @Param("idBodega") Long idBodega,
                       @Param("cantidad") Integer cantidad);

    @Query("SELECT SUM(i.stockActual) FROM InventarioMedicamento i WHERE i.medicamento.idMedicamento = :idMedicamento")
    Integer getStockTotalByMedicamento(@Param("idMedicamento") Long idMedicamento);
}
