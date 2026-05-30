package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.PacienteRequestDTO;
import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.IPacienteRepository;
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
public class PacienteService {

    private final IPacienteRepository pacienteRepository;

    public List<Paciente> findAll() {
        log.info("Obteniendo todos los pacientes");
        return pacienteRepository.findAll();
    }

    public Page<Paciente> findAll(Pageable pageable) {
        log.info("Obteniendo pacientes paginados: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());
        return pacienteRepository.findAll(pageable);
    }

    public Paciente findById(Long id) {
        log.info("Buscando paciente con ID: {}", id);
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + id));
    }

    @Transactional
    public Paciente create(PacienteRequestDTO request) {
        log.info("Creando nuevo paciente: {}", request.getNombre());

        if (request.getTelefono() != null && pacienteRepository.findByTelefono(request.getTelefono()).isPresent()) {
            throw new BusinessException("Ya existe un paciente con el teléfono: " + request.getTelefono());
        }

        Paciente paciente = new Paciente();
        paciente.setNombre(request.getNombre());
        paciente.setApellido(request.getApellido());
        paciente.setFechaNacimiento(request.getFechaNacimiento());
        paciente.setTelefono(request.getTelefono());
        paciente.setDireccion(request.getDireccion());
        paciente.setGenero(request.getGenero() != null ? request.getGenero().charAt(0) : null);

        Paciente saved = pacienteRepository.save(paciente);
        log.info("Paciente creado exitosamente con ID: {}", saved.getIdPaciente());
        return saved;
    }

    @Transactional
    public Paciente update(Long id, PacienteRequestDTO request) {
        log.info("Actualizando paciente con ID: {}", id);

        Paciente paciente = findById(id);

        if (request.getTelefono() != null && !request.getTelefono().equals(paciente.getTelefono())) {
            if (pacienteRepository.findByTelefono(request.getTelefono()).isPresent()) {
                throw new BusinessException("Ya existe un paciente con el teléfono: " + request.getTelefono());
            }
        }

        paciente.setNombre(request.getNombre());
        paciente.setApellido(request.getApellido());
        paciente.setFechaNacimiento(request.getFechaNacimiento());
        paciente.setTelefono(request.getTelefono());
        paciente.setDireccion(request.getDireccion());
        paciente.setGenero(request.getGenero() != null ? request.getGenero().charAt(0) : null);

        Paciente updated = pacienteRepository.save(paciente);
        log.info("Paciente actualizado exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando paciente con ID: {}", id);
        Paciente paciente = findById(id);
        pacienteRepository.delete(paciente);
        log.info("Paciente eliminado exitosamente: {}", id);
    }

    public List<Paciente> searchByNombre(String nombre) {
        log.info("Buscando pacientes por nombre: {}", nombre);
        return pacienteRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(nombre, nombre);
    }

    public List<Paciente> findByGenero(Character genero) {
        log.info("Buscando pacientes por género: {}", genero);
        return pacienteRepository.findByGenero(genero);
    }

    public List<Paciente> findPacientesConCitas() {
        log.info("Obteniendo pacientes con citas");
        return pacienteRepository.findPacientesConCitas();
    }

    public List<Paciente> findPacientesSinCitas() {
        log.info("Obteniendo pacientes sin citas");
        return pacienteRepository.findPacientesSinCitas();
    }
}
