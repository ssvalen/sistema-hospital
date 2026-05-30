package com.hospitaldb.backend.repository.clinico;

import com.hospitaldb.backend.entity.clinico.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMedicoRepository extends JpaRepository<Medico, Long> {

    List<Medico> findByEspecialidadIgnoreCase(String especialidad);

    List<Medico> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);

    Optional<Medico> findByEmail(String email);

    Optional<Medico> findByTelefono(String telefono);

    @Query("SELECT m FROM Medico m ORDER BY SIZE(m.citas) DESC")
    List<Medico> findMedicosMasActivos();

    @Query("SELECT m FROM Medico m WHERE SIZE(m.citas) = 0")
    List<Medico> findMedicosSinCitas();

    @Query("SELECT m.especialidad, COUNT(c) FROM Medico m LEFT JOIN m.citas c GROUP BY m.especialidad")
    List<Object[]> countCitasByEspecialidad();

    @Query("SELECT m FROM Medico m WHERE SIZE(m.citas) < :maxCitas")
    List<Medico> findMedicosDisponibles(@Param("maxCitas") Long maxCitas);

    @Query("SELECT DISTINCT m.especialidad FROM Medico m ORDER BY m.especialidad")
    List<String> findAllEspecialidades();
}
