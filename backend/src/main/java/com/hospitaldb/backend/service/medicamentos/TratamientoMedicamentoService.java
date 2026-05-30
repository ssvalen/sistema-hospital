package com.hospitaldb.backend.service.medicamentos;

import com.hospitaldb.backend.dto.request.TratamientoMedicamentoRequestDTO;
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

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TratamientoMedicamentoService {
    private final ITratamientoMedicamentoRepository tmRepository;
    private final ITratamientoRepository tratamientoRepository;
    private final IMedicamentoRepository medicamentoRepository;

    public List<TratamientoMedicamento> findAll() {
        log.info("Obteniendo todas las relaciones tratamiento-medicamento");
        return tmRepository.findAll();
    }

    public TratamientoMedicamento findById(Long id) {
        log.info("Buscando relación con ID: {}", id);
        return tmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relación no encontrada con ID: " + id));
    }

    @Transactional
    public TratamientoMedicamento create(TratamientoMedicamentoRequestDTO request) {
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
        return saved;
    }

    @Transactional
    public TratamientoMedicamento update(Long id, TratamientoMedicamentoRequestDTO request) {
        log.info("Actualizando relación con ID: {}", id);

        TratamientoMedicamento tm = findById(id);

        if (request.getDosis() != null) {
            tm.setDosis(request.getDosis());
        }

        if (request.getCantidad() != null) {
            tm.setCantidad(request.getCantidad());
        }

        TratamientoMedicamento updated = tmRepository.save(tm);
        log.info("Relación actualizada exitosamente");
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando relación con ID: {}", id);
        TratamientoMedicamento tm = findById(id);
        tmRepository.delete(tm);
        log.info("Relación eliminada exitosamente");
    }

    @Transactional
    public void deleteByTratamientoAndMedicamento(Long idTratamiento, Long idMedicamento) {
        log.info("Eliminando relación tratamiento {} - medicamento {}", idTratamiento, idMedicamento);
        tmRepository.deleteByTratamiento_IdTratamientoAndMedicamento_IdMedicamento(idTratamiento, idMedicamento);
        log.info("Relación eliminada exitosamente");
    }

    public List<TratamientoMedicamento> findByTratamiento(Long idTratamiento) {
        log.info("Buscando medicamentos del tratamiento: {}", idTratamiento);
        return tmRepository.findByTratamiento_IdTratamiento(idTratamiento);
    }

    public List<TratamientoMedicamento> findByMedicamento(Long idMedicamento) {
        log.info("Buscando tratamientos del medicamento: {}", idMedicamento);
        return tmRepository.findByMedicamento_IdMedicamento(idMedicamento);
    }

    public Integer getCantidadTotalRecetada(Long idMedicamento) {
        log.info("Calculando cantidad total recetada del medicamento: {}", idMedicamento);
        Integer cantidad = tmRepository.sumCantidadByMedicamento(idMedicamento);
        return cantidad != null ? cantidad : 0;
    }
}
