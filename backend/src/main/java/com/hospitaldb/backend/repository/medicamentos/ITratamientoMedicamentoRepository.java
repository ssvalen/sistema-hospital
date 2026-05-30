package com.hospitaldb.backend.repository.medicamentos;

import com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ITratamientoMedicamentoRepository extends JpaRepository<TratamientoMedicamento, Long> {

    List<TratamientoMedicamento> findByTratamiento_IdTratamiento(Long idTratamiento);

    List<TratamientoMedicamento> findByMedicamento_IdMedicamento(Long idMedicamento);

    List<TratamientoMedicamento> findByTratamiento_IdTratamientoAndMedicamento_IdMedicamento(Long idTratamiento, Long idMedicamento);

    @Modifying
    @Transactional
    void deleteByTratamiento_IdTratamientoAndMedicamento_IdMedicamento(Long idTratamiento, Long idMedicamento);

    @Query("SELECT SUM(tm.cantidad) FROM TratamientoMedicamento tm WHERE tm.medicamento.idMedicamento = :idMedicamento")
    Integer sumCantidadByMedicamento(@Param("idMedicamento") Long idMedicamento);
}