package com.hospitaldb.backend.service.medicamentos;

import com.hospitaldb.backend.dto.request.MedicamentoRequestDTO;
import com.hospitaldb.backend.entity.medicamentos.Medicamento;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.medicamentos.IMedicamentoRepository;
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

public class MedicamentoService {

    private final IMedicamentoRepository medicamentoRepository;

    public List<Medicamento> findAll() {
        log.info("Obteniendo todos los medicamentos");
        return medicamentoRepository.findAll();
    }

    public Page<Medicamento> findAll(Pageable pageable) {
        log.info("Obteniendo medicamentos paginados");
        return medicamentoRepository.findAll(pageable);
    }

    public Medicamento findById(Long id) {
        log.info("Buscando medicamento con ID: {}", id);
        return medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + id));
    }

    @Transactional
    public Medicamento create(MedicamentoRequestDTO request) {
        log.info("Creando nuevo medicamento: {}", request.getNombreComercial());

        if (medicamentoRepository.existsByNombreComercial(request.getNombreComercial())) {
            throw new BusinessException("Ya existe un medicamento con el nombre comercial: " + request.getNombreComercial());
        }

        Medicamento medicamento = new Medicamento();
        medicamento.setNombreComercial(request.getNombreComercial());
        medicamento.setPrincipioActivo(request.getPrincipioActivo());
        medicamento.setUnidadMedida(request.getUnidadMedida());

        Medicamento saved = medicamentoRepository.save(medicamento);
        log.info("Medicamento creado exitosamente con ID: {}", saved.getIdMedicamento());
        return saved;
    }

    @Transactional
    public Medicamento update(Long id, MedicamentoRequestDTO request) {
        log.info("Actualizando medicamento con ID: {}", id);

        Medicamento medicamento = findById(id);

        if (!medicamento.getNombreComercial().equals(request.getNombreComercial()) &&
                medicamentoRepository.existsByNombreComercial(request.getNombreComercial())) {
            throw new BusinessException("Ya existe un medicamento con el nombre comercial: " + request.getNombreComercial());
        }

        medicamento.setNombreComercial(request.getNombreComercial());
        medicamento.setPrincipioActivo(request.getPrincipioActivo());
        medicamento.setUnidadMedida(request.getUnidadMedida());

        Medicamento updated = medicamentoRepository.save(medicamento);
        log.info("Medicamento actualizado exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando medicamento con ID: {}", id);
        Medicamento medicamento = findById(id);

        if (!medicamento.getTratamientoMedicamentos().isEmpty()) {
            throw new BusinessException("No se puede eliminar un medicamento que está asociado a tratamientos");
        }

        if (!medicamento.getInventarios().isEmpty()) {
            throw new BusinessException("No se puede eliminar un medicamento que tiene inventario");
        }

        medicamentoRepository.delete(medicamento);
        log.info("Medicamento eliminado exitosamente: {}", id);
    }

    public List<Medicamento> searchByNombre(String nombre) {
        log.info("Buscando medicamentos por nombre: {}", nombre);
        return medicamentoRepository.findByNombreComercialContainingIgnoreCase(nombre);
    }

    public List<Medicamento> findByPrincipioActivo(String principioActivo) {
        log.info("Buscando medicamentos por principio activo: {}", principioActivo);
        return medicamentoRepository.findByPrincipioActivoContainingIgnoreCase(principioActivo);
    }

    public List<Object[]> findMedicamentosMasRecetados() {
        log.info("Obteniendo medicamentos más recetados");
        return medicamentoRepository.findMedicamentosMasRecetados();
    }

    public List<Medicamento> findMedicamentosConStockBajo() {
        log.info("Obteniendo medicamentos con stock bajo");
        return medicamentoRepository.findMedicamentosConStockBajo();
    }

    public List<Medicamento> searchMedicamentos(String busqueda) {
        log.info("Búsqueda general de medicamentos: {}", busqueda);
        return medicamentoRepository.searchMedicamentos(busqueda);
    }
}
