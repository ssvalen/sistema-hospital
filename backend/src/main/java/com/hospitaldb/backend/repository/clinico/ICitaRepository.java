package com.hospitaldb.backend.repository.clinico;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospitaldb.backend.entity.clinico.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ICitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByPaciente_IdPaciente(Long idPaciente);

    List<Cita> findByMedico_IdMedico(Long idMedico);

    List<Cita> findByEstado(String estado);

    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT c FROM Cita c WHERE c.paciente.idPaciente = :idPaciente AND c.fechaHora > :ahora ORDER BY c.fechaHora")
    List<Cita> findCitasFuturasByPaciente(@Param("idPaciente") Long idPaciente, @Param("ahora") LocalDateTime ahora);

    @Query("SELECT c FROM Cita c WHERE c.medico.idMedico = :idMedico AND c.fechaHora < :ahora")
    List<Cita> findCitasPasadasByMedico(@Param("idMedico") Long idMedico, @Param("ahora") LocalDateTime ahora);

    long countByEstado(String estado);

    @Query("SELECT COUNT(c) FROM Cita c WHERE c.medico.idMedico = :idMedico AND DATE(c.fechaHora) = DATE(:fechaHora) GROUP BY DATE(c.fechaHora)")
    int countCitasByDay(@Param("idMedico") Long idMedico, @Param("fechaHora")LocalDateTime fechaHora);

    @Modifying
    @Transactional
    @Query("UPDATE Cita c SET c.estado = :nuevoEstado WHERE c.idCita = :idCita")
    void updateEstadoCita(@Param("idCita") Long idCita, @Param("nuevoEstado") String nuevoEstado);

    @Modifying
    @Transactional
    @Query("UPDATE Cita c SET c.estado = 'CANCELADA' WHERE c.estado = 'PENDIENTE' AND c.fechaHora < :ahora")
    int cancelarCitasExpiradas(@Param("ahora") LocalDateTime ahora);
}
