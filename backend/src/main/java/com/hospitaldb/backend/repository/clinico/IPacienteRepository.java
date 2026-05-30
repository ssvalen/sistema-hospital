package com.hospitaldb.backend.repository.clinico;

import com.hospitaldb.backend.entity.clinico.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPacienteRepository extends JpaRepository<Paciente, Long>{
    List<Paciente> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);

    Optional<Paciente> findByTelefono(String telefono);

    List<Paciente> findByFechaNacimientoBetween(LocalDate fechaInicio, LocalDate fechaFin);

    List<Paciente> findByGenero(Character genero);

    List<Paciente> findByDireccionContainingIgnoreCase(String direccion);

    @Query("SELECT DISTINCT p FROM Paciente p JOIN p.citas c")
    List<Paciente> findPacientesConCitas();

    @Query("SELECT p FROM Paciente p WHERE p.idPaciente NOT IN (SELECT c.paciente.idPaciente FROM Cita c)")
    List<Paciente> findPacientesSinCitas();

    long countByGenero(Character genero);
}
