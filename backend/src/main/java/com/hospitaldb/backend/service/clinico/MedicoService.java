package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.MedicoRequestDTO;
import com.hospitaldb.backend.entity.clinico.Medico;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.IMedicoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MedicoService {
    private final IMedicoRepository medicoRepository;

    public List<Medico> findAll() {
        log.info("Obteniendo todos los médicos");
        return medicoRepository.findAll();
    }

    public Page<Medico> findAll(Pageable pageable) {
        log.info("Obteniendo médicos paginados");
        return medicoRepository.findAll(pageable);
    }

    public Medico findById(Long id) {
        log.info("Buscando médico con ID: {}", id);
        return medicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico no encontrado con ID: " + id));
    }

    @Transactional
    public Medico create(MedicoRequestDTO request) {
        log.info("Creando nuevo médico: {}", request.getNombre());

        if (request.getEmail() != null && medicoRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException("Ya existe un médico con el email: " + request.getEmail());
        }

        if (request.getTelefono() != null && medicoRepository.findByTelefono(request.getTelefono()).isPresent()) {
            throw new BusinessException("Ya existe un médico con el teléfono: " + request.getTelefono());
        }

        Medico medico = new Medico();
        medico.setNombre(request.getNombre());
        medico.setApellido(request.getApellido());
        medico.setEspecialidad(request.getEspecialidad());
        medico.setTelefono(request.getTelefono());
        medico.setEmail(request.getEmail());

        Medico saved = medicoRepository.save(medico);
        log.info("Médico creado exitosamente con ID: {}", saved.getIdMedico());
        return saved;
    }

    @Transactional
    public Medico update(Long id, MedicoRequestDTO request) {
        log.info("Actualizando médico con ID: {}", id);

        Medico medico = findById(id);

        if (request.getEmail() != null && !request.getEmail().equals(medico.getEmail())) {
            if (medicoRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new BusinessException("Ya existe un médico con el email: " + request.getEmail());
            }
            medico.setEmail(request.getEmail());
        }

        medico.setNombre(request.getNombre());
        medico.setApellido(request.getApellido());
        medico.setEspecialidad(request.getEspecialidad());

        if (request.getTelefono() != null) {
            medico.setTelefono(request.getTelefono());
        }

        Medico updated = medicoRepository.save(medico);
        log.info("Médico actualizado exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando médico con ID: {}", id);
        Medico medico = findById(id);

        if (!medico.getCitas().isEmpty()) {
            throw new BusinessException("No se puede eliminar un médico que tiene citas asociadas");
        }

        medicoRepository.delete(medico);
        log.info("Médico eliminado exitosamente: {}", id);
    }

    public List<Medico> findByEspecialidad(String especialidad) {
        log.info("Buscando médicos por especialidad: {}", especialidad);
        return medicoRepository.findByEspecialidadIgnoreCase(especialidad);
    }

    public List<Medico> findMedicosDisponibles(Long maxCitas) {
        log.info("Buscando médicos con menos de {} citas", maxCitas);
        return medicoRepository.findMedicosDisponibles(maxCitas);
    }

    public List<String> findAllEspecialidades() {
        log.info("Obteniendo todas las especialidades");
        return medicoRepository.findAllEspecialidades();
    }
}
