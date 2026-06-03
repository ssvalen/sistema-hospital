package com.hospitaldb.backend.repository.hospitalario;

import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.entity.hospitalario.IngresoEgreso;
import com.hospitaldb.backend.enums.EstadoIngreso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IIngresoEgresoRepository extends JpaRepository<IngresoEgreso, Long> {

    boolean existsByPacienteAndEstado(Paciente paciente, EstadoIngreso estado);

    List<IngresoEgreso> findByAreaIdAreaAndEstado(Long idArea, EstadoIngreso estado);

    List<IngresoEgreso> findByPacienteIdPacienteOrderByFechaIngresoDesc(Long idPaciente);


    List<IngresoEgreso> findAllByActivo(boolean activo);

    Page<IngresoEgreso> findAllByActivo(boolean activo, Pageable pageable);

}
