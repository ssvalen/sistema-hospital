package com.hospitaldb.backend.service.medicamentos;

import com.hospitaldb.backend.dto.request.MedicamentoRequestDTO;
import com.hospitaldb.backend.dto.response.medicamentos.MedicamentoDTO;
import com.hospitaldb.backend.entity.medicamentos.Medicamento;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.inventario.IInventarioMedicamentoRepository;
import com.hospitaldb.backend.repository.medicamentos.IMedicamentoRepository;
import com.hospitaldb.backend.service.auditoria.AuditService;
import com.hospitaldb.backend.utils.AuditAction;
import jakarta.servlet.http.HttpServletRequest;
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
public class MedicamentoService {

    private final IMedicamentoRepository medicamentoRepository;
    private final IInventarioMedicamentoRepository inventarioRepository;
    private final ModelMapper modelMapper;
    private final AuditService auditService;

    public List<MedicamentoDTO> findAll() {
        log.info("Obteniendo todos los medicamentos");
        List<Medicamento> medicamentos = findMedicamentoEntityAll();
        return medicamentos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private List<Medicamento> findMedicamentoEntityAll() {
        return medicamentoRepository.findAllByActivo(true);
    }

    public Page<MedicamentoDTO> findAll(Pageable pageable) {
        log.info("Obteniendo medicamentos paginados");
        Page<Medicamento> pageResult = medicamentoRepository.findAllByActivo(true, pageable);
        return pageResult.map(this::convertToDTO);
    }

    public MedicamentoDTO findById(Long id) {
        log.info("Buscando medicamento con ID: {}", id);
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + id));
        return convertToDTO(medicamento);
    }

    @Transactional
    public MedicamentoDTO create(MedicamentoRequestDTO request, HttpServletRequest httpRequest) {
        log.info("Creando nuevo medicamento: {}", request.getNombreComercial());

        if (medicamentoRepository.existsByNombreComercial(request.getNombreComercial())) {
            throw new BusinessException(
                    "Ya existe un medicamento con el nombre comercial: " + request.getNombreComercial());
        }

        Medicamento medicamento = new Medicamento();
        medicamento.setNombreComercial(request.getNombreComercial());
        medicamento.setPrincipioActivo(request.getPrincipioActivo());
        medicamento.setUnidadMedida(request.getUnidadMedida());

        Medicamento saved = medicamentoRepository.save(medicamento);

        auditService.log(
                AuditAction.CREATE,
                "Medicamento",
                String.valueOf(saved.getIdMedicamento()),
                null,
                copyMedicamento(saved),
                null,
                httpRequest);

        log.info("Medicamento creado exitosamente con ID: {}", saved.getIdMedicamento());

        return convertToDTO(saved);
    }

    @Transactional
    public MedicamentoDTO update(Long id, MedicamentoRequestDTO request, HttpServletRequest httpRequest) {

        log.info("Actualizando medicamento con ID: {}", id);

        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento no encontrado con ID: " + id));

        Medicamento before = copyMedicamento(medicamento);

        if (!medicamento.getNombreComercial().equals(request.getNombreComercial()) &&
                medicamentoRepository.existsByNombreComercial(request.getNombreComercial())) {
            throw new BusinessException(
                    "Ya existe un medicamento con el nombre comercial: " + request.getNombreComercial());
        }

        medicamento.setNombreComercial(request.getNombreComercial());
        medicamento.setPrincipioActivo(request.getPrincipioActivo());
        medicamento.setUnidadMedida(request.getUnidadMedida());

        Medicamento updated = medicamentoRepository.save(medicamento);

        auditService.log(
                AuditAction.UPDATE,
                "Medicamento",
                String.valueOf(updated.getIdMedicamento()),
                before,
                copyMedicamento(updated),
                null,
                httpRequest);

        log.info("Medicamento actualizado exitosamente: {}", id);

        return convertToDTO(updated);
    }

    @Transactional
    public void delete(Long id, HttpServletRequest httpRequest) {

        log.info("Eliminando medicamento con ID: {}", id);

        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medicamento no encontrado con ID: " + id));

        if (!medicamento.getTratamientoMedicamentos().isEmpty()) {
            throw new BusinessException(
                    "No se puede eliminar un medicamento que está asociado a tratamientos");
        }

        if (!medicamento.getInventarios().isEmpty()) {
            throw new BusinessException(
                    "No se puede eliminar un medicamento que tiene inventario");
        }

        Medicamento before = copyMedicamento(medicamento);

        medicamento.setActivo(false);

        Medicamento deleted = medicamentoRepository.save(medicamento);

        auditService.log(
                AuditAction.DELETE,
                "Medicamento",
                String.valueOf(id),
                before,
                null,
                null,
                httpRequest);

        log.info("Medicamento eliminado exitosamente: {}", id);
    }

    private Medicamento copyMedicamento(Medicamento medicamento) {
        Medicamento copy = new Medicamento();

        copy.setIdMedicamento(medicamento.getIdMedicamento());
        copy.setNombreComercial(medicamento.getNombreComercial());
        copy.setPrincipioActivo(medicamento.getPrincipioActivo());
        copy.setUnidadMedida(medicamento.getUnidadMedida());
        copy.setActivo(medicamento.getActivo());

        return copy;
    }

    public List<MedicamentoDTO> searchByNombre(String nombre) {
        log.info("Buscando medicamentos por nombre: {}", nombre);
        return medicamentoRepository.findByNombreComercialContainingIgnoreCase(nombre)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicamentoDTO> findByPrincipioActivo(String principioActivo) {
        log.info("Buscando medicamentos por principio activo: {}", principioActivo);
        return medicamentoRepository.findByPrincipioActivoContainingIgnoreCase(principioActivo)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Object[]> findMedicamentosMasRecetados() {
        log.info("Obteniendo medicamentos más recetados");
        return medicamentoRepository.findMedicamentosMasRecetados();
    }

    public List<MedicamentoDTO> findMedicamentosConStockBajo() {
        log.info("Obteniendo medicamentos con stock bajo");
        return medicamentoRepository.findMedicamentosConStockBajo()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicamentoDTO> findMedicamentosSinInventario() {
        log.info("Obteniendo medicamentos sin inventario");
        return medicamentoRepository.findMedicamentosSinInventario()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicamentoDTO> searchMedicamentos(String busqueda) {
        log.info("Búsqueda general de medicamentos: {}", busqueda);
        return medicamentoRepository.searchMedicamentos(busqueda)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MedicamentoDTO convertToDTO(Medicamento medicamento) {
        Integer stockTotal = inventarioRepository.getStockTotalByMedicamento(medicamento.getIdMedicamento());

        return MedicamentoDTO.builder()
                .idMedicamento(medicamento.getIdMedicamento())
                .nombreComercial(medicamento.getNombreComercial())
                .principioActivo(medicamento.getPrincipioActivo())
                .unidadMedida(medicamento.getUnidadMedida())
                .cantidadTratamientos(medicamento.getTratamientoMedicamentos() != null
                        ? medicamento.getTratamientoMedicamentos().size()
                        : 0)
                .stockTotal(stockTotal != null ? stockTotal : 0)
                .build();
    }
}