package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.TratamientoRequestDTO;
import com.hospitaldb.backend.entity.clinico.Cita;
import com.hospitaldb.backend.entity.clinico.Tratamiento;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.ICitaRepository;
import com.hospitaldb.backend.repository.clinico.ITratamientoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TratamientoService {
    private final ITratamientoRepository tratamientoRepository;
    private final ICitaRepository citaRepository;

    public List<Tratamiento> findAll() {
        log.info("Obteniendo todos los tratamientos");
        return tratamientoRepository.findAll();
    }

    public Page<Tratamiento> findAll(Pageable pageable) {
        log.info("Obteniendo tratamientos paginados");
        return tratamientoRepository.findAll(pageable);
    }

    public Tratamiento findById(Long id) {
        log.info("Buscando tratamiento con ID: {}", id);
        return tratamientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con ID: " + id));
    }

    @Transactional
    public Tratamiento create(TratamientoRequestDTO request) {
        log.info("Creando nuevo tratamiento");

        Cita cita = citaRepository.findById(request.getIdCita())
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + request.getIdCita()));

        // Validar que la fecha fin sea posterior a la fecha inicio
        if (request.getFechaFin() != null && request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new BusinessException("La fecha fin debe ser posterior a la fecha de inicio");
        }

        Tratamiento tratamiento = new Tratamiento();
        tratamiento.setDescripcion(request.getDescripcion());
        tratamiento.setFechaInicio(request.getFechaInicio());
        tratamiento.setFechaFin(request.getFechaFin());
        tratamiento.setCita(cita);

        Tratamiento saved = tratamientoRepository.save(tratamiento);
        log.info("Tratamiento creado exitosamente con ID: {}", saved.getIdTratamiento());
        return saved;
    }

    @Transactional
    public Tratamiento update(Long id, TratamientoRequestDTO request) {
        log.info("Actualizando tratamiento con ID: {}", id);

        Tratamiento tratamiento = findById(id);

        if (request.getIdCita() != null && !tratamiento.getCita().getIdCita().equals(request.getIdCita())) {
            Cita cita = citaRepository.findById(request.getIdCita())
                    .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + request.getIdCita()));
            tratamiento.setCita(cita);
        }

        // Validar fechas
        LocalDate fechaFin = request.getFechaFin() != null ? request.getFechaFin() : tratamiento.getFechaFin();
        if (fechaFin != null && request.getFechaInicio().isAfter(fechaFin)) {
            throw new BusinessException("La fecha fin debe ser posterior a la fecha de inicio");
        }

        tratamiento.setDescripcion(request.getDescripcion());
        tratamiento.setFechaInicio(request.getFechaInicio());
        tratamiento.setFechaFin(request.getFechaFin());

        Tratamiento updated = tratamientoRepository.save(tratamiento);
        log.info("Tratamiento actualizado exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando tratamiento con ID: {}", id);
        Tratamiento tratamiento = findById(id);

        if (!tratamiento.getTratamientoMedicamentos().isEmpty()) {
            throw new BusinessException("No se puede eliminar un tratamiento que tiene medicamentos asociados");
        }

        tratamientoRepository.delete(tratamiento);
        log.info("Tratamiento eliminado exitosamente: {}", id);
    }

    public List<Tratamiento> findByCita(Long idCita) {
        log.info("Buscando tratamientos de la cita: {}", idCita);
        return tratamientoRepository.findByCita_IdCita(idCita);
    }

    public List<Tratamiento> findTratamientosActivos() {
        log.info("Buscando tratamientos activos");
        return tratamientoRepository.findTratamientosActivos(LocalDate.now());
    }

    public List<Tratamiento> findTratamientosByPaciente(Long idPaciente) {
        log.info("Buscando tratamientos del paciente: {}", idPaciente);
        return tratamientoRepository.findTratamientosByPaciente(idPaciente);
    }

    public List<Tratamiento> findTratamientosByMedico(Long idMedico) {
        log.info("Buscando tratamientos del médico: {}", idMedico);
        return tratamientoRepository.findTratamientosByMedico(idMedico);
    }

    public List<Tratamiento> findTratamientosConMedicamentos() {
        log.info("Buscando tratamientos con medicamentos");
        return tratamientoRepository.findTratamientosConMedicamentos();
    }
}
