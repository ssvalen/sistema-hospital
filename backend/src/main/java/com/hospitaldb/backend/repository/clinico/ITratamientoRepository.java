package com.hospitaldb.backend.repository.clinico;

import com.hospitaldb.backend.entity.clinico.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ITratamientoRepository extends JpaRepository<Tratamiento, Long> {

    List<Tratamiento> findByCita_IdCita(Long idCita);

    List<Tratamiento> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);

    @Query("SELECT t FROM Tratamiento t WHERE t.fechaInicio <= :hoy AND (t.fechaFin IS NULL OR t.fechaFin >= :hoy)")
    List<Tratamiento> findTratamientosActivos(@Param("hoy") LocalDate hoy);

    @Query("SELECT t FROM Tratamiento t WHERE t.fechaFin IS NOT NULL AND t.fechaFin < :hoy")
    List<Tratamiento> findTratamientosFinalizados(@Param("hoy") LocalDate hoy);

    @Query("SELECT t FROM Tratamiento t WHERE t.cita.paciente.idPaciente = :idPaciente")
    List<Tratamiento> findTratamientosByPaciente(@Param("idPaciente") Long idPaciente);

    @Query("SELECT t FROM Tratamiento t WHERE t.cita.medico.idMedico = :idMedico")
    List<Tratamiento> findTratamientosByMedico(@Param("idMedico") Long idMedico);

    @Query("SELECT DISTINCT t FROM Tratamiento t JOIN t.tratamientoMedicamentos tm")
    List<Tratamiento> findTratamientosConMedicamentos();
}