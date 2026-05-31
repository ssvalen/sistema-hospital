package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.PacienteRequestDTO;
import com.hospitaldb.backend.dto.response.clinico.PacienteDTO;
import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.IPacienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PacienteService {

    private final IPacienteRepository pacienteRepository;

    private final ModelMapper modelMapper;

    public List<PacienteDTO> findAll() {
        log.info("Obteniendo todos los pacientes");
        List<Paciente> pacientes = pacienteRepository.findAll();
        return pacientes.stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
    }


    public Page<PacienteDTO> findAll(Pageable pageable) {
        log.info("Obteniendo pacientes paginados");
        Page<Paciente> pageResult = pacienteRepository.findAll(pageable);
        return pageResult.map(paciente -> modelMapper.map(paciente, PacienteDTO.class));
    }

    public PacienteDTO findById(Long id) {
        log.info("Buscando paciente con ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + id));
        return modelMapper.map(paciente, PacienteDTO.class);
    }

    @Transactional
    public PacienteDTO create(PacienteRequestDTO request) {
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
        return modelMapper.map(saved, PacienteDTO.class);
    }

    @Transactional
    public PacienteDTO update(Long id, PacienteRequestDTO request) {
        log.info("Actualizando paciente con ID: {}", id);

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + id));

        if (request.getTelefono() != null && !request.getTelefono().equals(paciente.getTelefono()) &&
                pacienteRepository.findByTelefono(request.getTelefono()).isPresent()) {
            throw new BusinessException("Ya existe un paciente con el teléfono: " + request.getTelefono());
        }

        paciente.setNombre(request.getNombre());
        paciente.setApellido(request.getApellido());
        paciente.setFechaNacimiento(request.getFechaNacimiento());
        paciente.setTelefono(request.getTelefono());
        paciente.setDireccion(request.getDireccion());
        paciente.setGenero(request.getGenero() != null ? request.getGenero().charAt(0) : null);

        Paciente updated = pacienteRepository.save(paciente);
        log.info("Paciente actualizado exitosamente: {}", id);
        return modelMapper.map(updated, PacienteDTO.class);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando paciente con ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID: " + id));
        pacienteRepository.delete(paciente);
        log.info("Paciente eliminado exitosamente: {}", id);
    }

    public List<PacienteDTO> searchByNombre(String nombre) {
        log.info("Buscando pacientes por nombre: {}", nombre);
        List<Paciente> pacientes = pacienteRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(nombre, nombre);
        return pacientes.stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
    }

    public List<PacienteDTO> findByGenero(Character genero) {
        log.info("Buscando pacientes por género: {}", genero);
        List<Paciente> pacientes = pacienteRepository.findByGenero(genero);
        return pacientes.stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
    }

    public List<PacienteDTO> findPacientesConCitas() {
        log.info("Obteniendo pacientes con citas");
        List<Paciente> pacientes = pacienteRepository.findPacientesConCitas();
        return pacientes.stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
    }

    public List<PacienteDTO> findPacientesSinCitas() {
        log.info("Obteniendo pacientes sin citas");
        List<Paciente> pacientes = pacienteRepository.findPacientesSinCitas();
        return pacientes.stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
    }
}
