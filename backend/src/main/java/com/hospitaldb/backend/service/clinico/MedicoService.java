package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.MedicoRequestDTO;
import com.hospitaldb.backend.dto.response.clinico.MedicoDTO;
import com.hospitaldb.backend.entity.clinico.Medico;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.IMedicoRepository;
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
public class MedicoService {
    private final IMedicoRepository medicoRepository;

    private final ModelMapper modelMapper;

    public List<MedicoDTO> findAll() {
        log.info("Obteniendo todos los médicos");
        List<Medico> medicos = medicoRepository.findAll();
        return medicos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<MedicoDTO> findAll(Pageable pageable) {
        log.info("Obteniendo médicos paginados");
        Page<Medico> pageResult = medicoRepository.findAll(pageable);
        return pageResult.map(this::convertToDTO);
    }

    public MedicoDTO findById(Long id) {
        log.info("Buscando médico con ID: {}", id);
        Medico medico = findMedicoEntityById(id);
        return convertToDTO(medico);
    }

    @Transactional
    public MedicoDTO create(MedicoRequestDTO request) {
        log.info("Creando nuevo médico: {}", request.getNombre());

        if (request.getEmail() != null && medicoRepository.existsMedicoByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe un médico con el email: " + request.getEmail());
        }

        if (request.getTelefono() != null && medicoRepository.existsMedicoByTelefono(request.getTelefono())) {
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
        return convertToDTO(saved);
    }

    @Transactional
    public MedicoDTO update(Long id, MedicoRequestDTO request) {
        log.info("Actualizando médico con ID: {}", id);

        Medico medico = findMedicoEntityById(id);

        if (request.getEmail() != null && !request.getEmail().equals(medico.getEmail()) &&
                medicoRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException("Ya existe un médico con el email: " + request.getEmail());
        }

        medico.setNombre(request.getNombre());
        medico.setApellido(request.getApellido());
        medico.setEspecialidad(request.getEspecialidad());

        if (request.getTelefono() != null) {
            medico.setTelefono(request.getTelefono());
        }

        if (request.getEmail() != null) {
            medico.setEmail(request.getEmail());
        }

        Medico updated = medicoRepository.save(medico);
        log.info("Médico actualizado exitosamente: {}", id);
        return convertToDTO(updated);
    }

    private Medico findMedicoEntityById(Long id){
        return medicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médico no encontrado con ID: " + id));
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando médico con ID: {}", id);
        Medico medico = findMedicoEntityById(id);

        if (!medico.getCitas().isEmpty()) {
            throw new BusinessException("No se puede eliminar un médico que tiene citas asociadas");
        }

        medicoRepository.delete(medico);
        log.info("Médico eliminado exitosamente: {}", id);
    }

    public List<MedicoDTO> findByEspecialidad(String especialidad) {
        log.info("Buscando médicos por especialidad: {}", especialidad);
        List<Medico> medicos = medicoRepository.findByEspecialidadIgnoreCase(especialidad);
        return medicos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicoDTO> findMedicosDisponibles(Long maxCitas) {
        log.info("Buscando médicos con menos de {} citas", maxCitas);
        List<Medico> medicos = medicoRepository.findMedicosDisponibles(maxCitas);
        return medicos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> findAllEspecialidades() {
        log.info("Obteniendo todas las especialidades");
        return medicoRepository.findAllEspecialidades();
    }

    public List<MedicoDTO> findMedicosMasActivos() {
        log.info("Obteniendo médicos más activos");
        List<Medico> medicos = medicoRepository.findMedicosMasActivos();
        return medicos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicoDTO> findMedicosSinCitas() {
        log.info("Obteniendo médicos sin citas");
        List<Medico> medicos = medicoRepository.findMedicosSinCitas();
        return medicos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Object[]> countCitasByEspecialidad() {
        log.info("Contando citas por especialidad");
        return medicoRepository.countCitasByEspecialidad();
    }

    private MedicoDTO convertToDTO(Medico medico) {
        return MedicoDTO.builder()
                .idMedico(medico.getIdMedico())
                .nombre(medico.getNombre())
                .apellido(medico.getApellido())
                .especialidad(medico.getEspecialidad())
                .telefono(medico.getTelefono())
                .email(medico.getEmail())
                .cantidadCitas(medico.getCitas() != null ? medico.getCitas().size() : 0)
                .build();
    }
}
