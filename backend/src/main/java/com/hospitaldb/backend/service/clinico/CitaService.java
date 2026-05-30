package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.CitaRequestDTO;
import com.hospitaldb.backend.entity.clinico.Cita;
import com.hospitaldb.backend.entity.clinico.Medico;
import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.ICitaRepository;
import com.hospitaldb.backend.repository.clinico.IMedicoRepository;
import com.hospitaldb.backend.repository.clinico.IPacienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CitaService {

    private final ICitaRepository citaRepository;
    private final IPacienteRepository pacienteRepository;
    private final IMedicoRepository medicoRepository;

    public List<Cita> findAll() {
        log.info("Obteniendo todas las citas");
        return citaRepository.findAll();
    }

    public Page<Cita> findAll(Pageable pageable) {
        log.info("Obteniendo citas paginadas");
        return citaRepository.findAll(pageable);
    }

    public Cita findById(Long id) {
        log.info("Buscando cita con ID: {}", id);
        return citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
    }

    @Transactional
    public Cita create(CitaRequestDTO request) {
        log.info("Creando nueva cita para paciente: {}, médico: {}", request.getIdPaciente(), request.getIdMedico());

        Paciente paciente = pacienteRepository.findById(request.getIdPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + request.getIdPaciente()));

        Medico medico = medicoRepository.findById(request.getIdMedico())
                .orElseThrow(() -> new ResourceNotFoundException("Médico no encontrado con ID: " + request.getIdMedico()));

        if (request.getFechaHora().isBefore(LocalDateTime.now())) {
            throw new BusinessException("La cita debe ser agendada en una fecha futura");
        }

        boolean tieneCita = citaRepository.findByMedico_IdMedico(medico.getIdMedico()).stream()
                .anyMatch(c -> c.getFechaHora().equals(request.getFechaHora()));

        if (tieneCita) {
            throw new BusinessException("El médico ya tiene una cita agendada en esa fecha y hora");
        }

        Cita cita = new Cita();
        cita.setFechaHora(request.getFechaHora());
        cita.setEstado(request.getEstado() != null ? request.getEstado() : "PENDIENTE");
        cita.setPaciente(paciente);
        cita.setMedico(medico);

        Cita saved = citaRepository.save(cita);
        log.info("Cita creada exitosamente con ID: {}", saved.getIdCita());
        return saved;
    }

    @Transactional
    public Cita update(Long id, CitaRequestDTO request) {
        log.info("Actualizando cita con ID: {}", id);

        Cita cita = findById(id);

        if (request.getFechaHora().isBefore(LocalDateTime.now())) {
            throw new BusinessException("No se puede reprogramar una cita a una fecha pasada");
        }

        if (!cita.getMedico().getIdMedico().equals(request.getIdMedico())) {
            Medico nuevoMedico = medicoRepository.findById(request.getIdMedico())
                    .orElseThrow(() -> new ResourceNotFoundException("Médico no encontrado con ID: " + request.getIdMedico()));

            boolean tieneCita = citaRepository.findByMedico_IdMedico(nuevoMedico.getIdMedico()).stream()
                    .anyMatch(c -> c.getFechaHora().equals(request.getFechaHora()) && !c.getIdCita().equals(id));

            if (tieneCita) {
                throw new BusinessException("El nuevo médico ya tiene una cita en esa fecha y hora");
            }

            cita.setMedico(nuevoMedico);
        }

        cita.setFechaHora(request.getFechaHora());

        if (request.getEstado() != null) {
            cita.setEstado(request.getEstado());
        }

        Cita updated = citaRepository.save(cita);
        log.info("Cita actualizada exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void cancel(Long id) {
        log.info("Cancelando cita con ID: {}", id);
        Cita cita = findById(id);

        if (cita.getFechaHora().isBefore(LocalDateTime.now())) {
            throw new BusinessException("No se puede cancelar una cita pasada");
        }

        cita.setEstado("CANCELADA");
        citaRepository.save(cita);
        log.info("Cita cancelada exitosamente: {}", id);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando cita con ID: {}", id);
        Cita cita = findById(id);
        citaRepository.delete(cita);
        log.info("Cita eliminada exitosamente: {}", id);
    }

    public List<Cita> findByPaciente(Long idPaciente) {
        log.info("Buscando citas del paciente: {}", idPaciente);
        return citaRepository.findByPaciente_IdPaciente(idPaciente);
    }

    public List<Cita> findByMedico(Long idMedico) {
        log.info("Buscando citas del médico: {}", idMedico);
        return citaRepository.findByMedico_IdMedico(idMedico);
    }

    public List<Cita> findCitasFuturasByPaciente(Long idPaciente) {
        log.info("Buscando citas futuras del paciente: {}", idPaciente);
        return citaRepository.findCitasFuturasByPaciente(idPaciente, LocalDateTime.now());
    }

    public List<Cita> findByEstado(String estado) {
        log.info("Buscando citas por estado: {}", estado);
        return citaRepository.findByEstado(estado);
    }
}
