package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.CitaRequestDTO;
import com.hospitaldb.backend.dto.response.clinico.CitaDTO;
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
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CitaService {

    private final ICitaRepository citaRepository;
    private final IPacienteRepository pacienteRepository;
    private final IMedicoRepository medicoRepository;
    private final ModelMapper modelMapper;

    public List<CitaDTO> findAll() {
        log.info("Obteniendo todas las citas");
        List<Cita> citas = citaRepository.findAll();
        return citas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<CitaDTO> findAll(Pageable pageable) {
        log.info("Obteniendo citas paginadas");
        Page<Cita> pageResult = citaRepository.findAll(pageable);
        return pageResult.map(this::convertToDTO);
    }

    public CitaDTO findById(Long id) {
        log.info("Buscando cita con ID: {}", id);
        Cita cita = findCitaEntityById(id);
        return convertToDTO(cita);
    }

    private Cita findCitaEntityById(Long id){
        return citaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
    }

    @Transactional
    public CitaDTO create(CitaRequestDTO request) {
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

        if(citaRepository.countCitasByDay(request.getIdMedico(),request.getFechaHora()) >= 5)
            throw new BusinessException("El médico ya tiene el máximo de citas asignadas durante el día");
        Cita cita = new Cita();
        cita.setFechaHora(request.getFechaHora());
        cita.setEstado(request.getEstado() != null ? request.getEstado() : "PENDIENTE");
        cita.setPaciente(paciente);
        cita.setMedico(medico);

        Cita saved = citaRepository.save(cita);
        log.info("Cita creada exitosamente con ID: {}", saved.getIdCita());
        return convertToDTO(saved);
    }

    @Transactional
    public CitaDTO update(Long id, CitaRequestDTO request) {
        log.info("Actualizando cita con ID: {}", id);

        Cita cita = findCitaEntityById(id);

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
        return convertToDTO(updated);
    }

    @Transactional
    public void cancel(Long id) {
        log.info("Cancelando cita con ID: {}", id);
        Cita cita = findCitaEntityById(id);

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
        Cita cita = findCitaEntityById(id);
        citaRepository.delete(cita);
        log.info("Cita eliminada exitosamente: {}", id);
    }

    public List<CitaDTO> findByPaciente(Long idPaciente) {
        log.info("Buscando citas del paciente: {}", idPaciente);
        List<Cita> citas = citaRepository.findByPaciente_IdPaciente(idPaciente);
        return citas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CitaDTO> findByMedico(Long idMedico) {
        log.info("Buscando citas del médico: {}", idMedico);
        List<Cita> citas = citaRepository.findByMedico_IdMedico(idMedico);
        return citas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CitaDTO> findCitasFuturasByPaciente(Long idPaciente) {
        log.info("Buscando citas futuras del paciente: {}", idPaciente);
        List<Cita> citas = citaRepository.findCitasFuturasByPaciente(idPaciente, LocalDateTime.now());
        return citas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CitaDTO> findByEstado(String estado) {
        log.info("Buscando citas por estado: {}", estado);
        List<Cita> citas = citaRepository.findByEstado(estado);
        return citas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CitaDTO convertToDTO(Cita cita) {
        return CitaDTO.builder()
                .idCita(cita.getIdCita())
                .fechaHora(cita.getFechaHora())
                .estado(cita.getEstado())
                .idPaciente(cita.getPaciente().getIdPaciente())
                .pacienteNombre(cita.getPaciente().getNombre())
                .pacienteApellido(cita.getPaciente().getApellido())
                .idMedico(cita.getMedico().getIdMedico())
                .medicoNombre(cita.getMedico().getNombre())
                .medicoApellido(cita.getMedico().getApellido())
                .medicoEspecialidad(cita.getMedico().getEspecialidad())
                .build();
    }
}
