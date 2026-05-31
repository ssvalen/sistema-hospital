package com.hospitaldb.backend.service.clinico;

import com.hospitaldb.backend.dto.request.TratamientoRequestDTO;
import com.hospitaldb.backend.dto.response.clinico.MedicamentoAsignadoDTO;
import com.hospitaldb.backend.dto.response.clinico.TratamientoDTO;
import com.hospitaldb.backend.entity.clinico.Cita;
import com.hospitaldb.backend.entity.clinico.Tratamiento;
import com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TratamientoService {
    private final ITratamientoRepository tratamientoRepository;
    private final ICitaRepository citaRepository;

    public List<TratamientoDTO> findAll() {
        log.info("Obteniendo todos los tratamientos");
        List<Tratamiento> tratamientos = tratamientoRepository.findAll();
        return tratamientos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<TratamientoDTO> findAll(Pageable pageable) {
        log.info("Obteniendo tratamientos paginados");
        Page<Tratamiento> pageResult = tratamientoRepository.findAll(pageable);
        return pageResult.map(this::convertToDTO);
    }

    public TratamientoDTO findById(Long id) {
        log.info("Buscando tratamiento con ID: {}", id);
        Tratamiento tratamiento = findTratamientoEntityById(id);
        return convertToDTO(tratamiento);
    }

    private Tratamiento findTratamientoEntityById(Long id){
        return tratamientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con ID: " + id));
    }

    @Transactional
    public TratamientoDTO create(TratamientoRequestDTO request) {
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
        return convertToDTO(saved);
    }

    @Transactional
    public TratamientoDTO update(Long id, TratamientoRequestDTO request) {
        log.info("Actualizando tratamiento con ID: {}", id);

        Tratamiento tratamiento = findTratamientoEntityById(id);

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
        return convertToDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando tratamiento con ID: {}", id);
        Tratamiento tratamiento = findTratamientoEntityById(id);

        if (!tratamiento.getTratamientoMedicamentos().isEmpty()) {
            throw new BusinessException("No se puede eliminar un tratamiento que tiene medicamentos asociados");
        }

        tratamientoRepository.delete(tratamiento);
        log.info("Tratamiento eliminado exitosamente: {}", id);
    }

    public List<TratamientoDTO> findByCita(Long idCita) {
        log.info("Buscando tratamientos de la cita: {}", idCita);
        citaRepository.findById(idCita)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + idCita));

        List<Tratamiento> tratamientos = tratamientoRepository.findByCita_IdCita(idCita);
        return tratamientos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TratamientoDTO> findTratamientosActivos() {
        log.info("Buscando tratamientos activos");
        List<Tratamiento> tratamientos = tratamientoRepository.findTratamientosActivos(LocalDate.now());
        return tratamientos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TratamientoDTO> findTratamientosByPaciente(Long idPaciente) {
        log.info("Buscando tratamientos del paciente: {}", idPaciente);
        List<Tratamiento> tratamientos = tratamientoRepository.findTratamientosByPaciente(idPaciente);
        return tratamientos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TratamientoDTO> findTratamientosByMedico(Long idMedico) {
        log.info("Buscando tratamientos del médico: {}", idMedico);
        List<Tratamiento> tratamientos = tratamientoRepository.findTratamientosByMedico(idMedico);
        return tratamientos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TratamientoDTO> findTratamientosConMedicamentos() {
        log.info("Buscando tratamientos con medicamentos");
        List<Tratamiento> tratamientos = tratamientoRepository.findTratamientosConMedicamentos();
        return tratamientos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TratamientoDTO convertToDTO(Tratamiento tratamiento) {
        Cita cita = tratamiento.getCita();

        return TratamientoDTO.builder()
                .idTratamiento(tratamiento.getIdTratamiento())
                .descripcion(tratamiento.getDescripcion())
                .fechaInicio(tratamiento.getFechaInicio())
                .fechaFin(tratamiento.getFechaFin())
                .idCita(cita.getIdCita())
                .citaFechaHora(cita.getFechaHora() != null ? cita.getFechaHora().toString() : null)
                .citaEstado(cita.getEstado())
                .idPaciente(cita.getPaciente().getIdPaciente())
                .pacienteNombre(cita.getPaciente().getNombre())
                .pacienteApellido(cita.getPaciente().getApellido())
                .pacienteTelefono(cita.getPaciente().getTelefono())
                .idMedico(cita.getMedico().getIdMedico())
                .medicoNombre(cita.getMedico().getNombre())
                .medicoApellido(cita.getMedico().getApellido())
                .medicoEspecialidad(cita.getMedico().getEspecialidad())
                .medicamentos(convertMedicamentosToDTO(tratamiento.getTratamientoMedicamentos()))
                .build();
    }

    private List<MedicamentoAsignadoDTO> convertMedicamentosToDTO(List<TratamientoMedicamento> tratamientoMedicamentos) {
        if (tratamientoMedicamentos == null || tratamientoMedicamentos.isEmpty()) {
            return List.of();
        }

        return tratamientoMedicamentos.stream()
                .map(tm -> MedicamentoAsignadoDTO.builder()
                        .id(tm.getId())
                        .idMedicamento(tm.getMedicamento().getIdMedicamento())
                        .nombreComercial(tm.getMedicamento().getNombreComercial())
                        .principioActivo(tm.getMedicamento().getPrincipioActivo())
                        .dosis(tm.getDosis())
                        .cantidad(tm.getCantidad())
                        .unidadMedida(tm.getMedicamento().getUnidadMedida())
                        .build())
                .collect(Collectors.toList());
    }
}
