package com.hospitaldb.backend.service.medicamentos;

import com.hospitaldb.backend.dto.request.TratamientoMedicamentoRequestDTO;
import com.hospitaldb.backend.dto.response.medicamentos.TratamientoMedicamentoDTO;
import com.hospitaldb.backend.entity.clinico.Tratamiento;
import com.hospitaldb.backend.entity.medicamentos.Medicamento;
import com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.ITratamientoRepository;
import com.hospitaldb.backend.repository.medicamentos.IMedicamentoRepository;
import com.hospitaldb.backend.repository.medicamentos.ITratamientoMedicamentoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TratamientoMedicamentoService {
    private final ITratamientoMedicamentoRepository tmRepository;
    private final ITratamientoRepository tratamientoRepository;
    private final IMedicamentoRepository medicamentoRepository;

    public List<TratamientoMedicamentoDTO> findAll() {
        log.info("Obteniendo todas las relaciones tratamiento-medicamento");
        List<TratamientoMedicamento> relaciones = tmRepository.findAll();
        return relaciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TratamientoMedicamentoDTO findById(Long id) {
        log.info("Buscando relación con ID: {}", id);
        TratamientoMedicamento tm = tmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación no encontrada con ID: " + id));
        return convertToDTO(tm);
    }

    @Transactional
    public TratamientoMedicamentoDTO create(TratamientoMedicamentoRequestDTO request) {
        log.info("Asignando medicamento a tratamiento");

        Tratamiento tratamiento = tratamientoRepository.findById(request.getIdTratamiento())
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con ID: " + request.getIdTratamiento()));

        Medicamento medicamento = medicamentoRepository.findById(request.getIdMedicamento())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + request.getIdMedicamento()));

        // Verificar si ya existe la relación
        List<TratamientoMedicamento> existentes = tmRepository.findByTratamiento_IdTratamientoAndMedicamento_IdMedicamento(
                request.getIdTratamiento(), request.getIdMedicamento());

        if (!existentes.isEmpty()) {
            throw new BusinessException("El medicamento ya está asignado a este tratamiento");
        }

        TratamientoMedicamento tm = new TratamientoMedicamento();
        tm.setTratamiento(tratamiento);
        tm.setMedicamento(medicamento);
        tm.setDosis(request.getDosis());
        tm.setCantidad(request.getCantidad());

        TratamientoMedicamento saved = tmRepository.save(tm);
        log.info("Medicamento asignado exitosamente al tratamiento");
        return convertToDTO(saved);
    }


    @Transactional
    public TratamientoMedicamentoDTO update(Long id, TratamientoMedicamentoRequestDTO request) {
        log.info("Actualizando relación con ID: {}", id);

        TratamientoMedicamento tm = tmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación no encontrada con ID: " + id));

        if (request.getDosis() != null) {
            tm.setDosis(request.getDosis());
        }

        if (request.getCantidad() != null) {
            tm.setCantidad(request.getCantidad());
        }

        TratamientoMedicamento updated = tmRepository.save(tm);
        log.info("Relación actualizada exitosamente");
        return convertToDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando relación con ID: {}", id);
        TratamientoMedicamento tm = tmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación no encontrada con ID: " + id));
        tmRepository.delete(tm);
        log.info("Relación eliminada exitosamente");
    }

    @Transactional
    public void deleteByTratamientoAndMedicamento(Long idTratamiento, Long idMedicamento) {
        log.info("Eliminando relación tratamiento {} - medicamento {}", idTratamiento, idMedicamento);
        tmRepository.deleteByTratamiento_IdTratamientoAndMedicamento_IdMedicamento(idTratamiento, idMedicamento);
        log.info("Relación eliminada exitosamente");
    }

    public List<TratamientoMedicamentoDTO> findByTratamiento(Long idTratamiento) {
        log.info("Buscando medicamentos del tratamiento: {}", idTratamiento);
        List<TratamientoMedicamento> relaciones = tmRepository.findByTratamiento_IdTratamiento(idTratamiento);
        return relaciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TratamientoMedicamentoDTO> findByMedicamento(Long idMedicamento) {
        log.info("Buscando tratamientos del medicamento: {}", idMedicamento);
        List<TratamientoMedicamento> relaciones = tmRepository.findByMedicamento_IdMedicamento(idMedicamento);
        return relaciones.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Integer getCantidadTotalRecetada(Long idMedicamento) {
        log.info("Calculando cantidad total recetada del medicamento: {}", idMedicamento);
        Integer cantidad = tmRepository.sumCantidadByMedicamento(idMedicamento);
        return cantidad != null ? cantidad : 0;
    }

    private TratamientoMedicamentoDTO convertToDTO(TratamientoMedicamento tm) {
        return TratamientoMedicamentoDTO.builder()
                .id(tm.getId())
                .idTratamiento(tm.getTratamiento().getIdTratamiento())
                .tratamientoDescripcion(tm.getTratamiento().getDescripcion())
                .idMedicamento(tm.getMedicamento().getIdMedicamento())
                .medicamentoNombre(tm.getMedicamento().getNombreComercial())
                .medicamentoPrincipioActivo(tm.getMedicamento().getPrincipioActivo())
                .dosis(tm.getDosis())
                .cantidad(tm.getCantidad())
                .build();
    }
}
