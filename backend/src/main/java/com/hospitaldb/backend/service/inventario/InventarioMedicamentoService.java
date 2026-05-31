package com.hospitaldb.backend.service.inventario;

import com.hospitaldb.backend.dto.request.InventarioMedicamentoRequestDTO;
import com.hospitaldb.backend.dto.response.inventario.InventarioMedicamentoDTO;
import com.hospitaldb.backend.entity.inventario.Bodega;
import com.hospitaldb.backend.entity.inventario.InventarioMedicamento;
import com.hospitaldb.backend.entity.medicamentos.Medicamento;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.inventario.IBodegaRepository;
import com.hospitaldb.backend.repository.inventario.IInventarioMedicamentoRepository;
import com.hospitaldb.backend.repository.medicamentos.IMedicamentoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class InventarioMedicamentoService {

    private final IInventarioMedicamentoRepository inventarioRepository;
    private final IMedicamentoRepository medicamentoRepository;
    private final IBodegaRepository bodegaRepository;

    public List<InventarioMedicamentoDTO> findAll() {
        log.info("Obteniendo todo el inventario");
        List<InventarioMedicamento> inventarios = inventarioRepository.findAll();
        return inventarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<InventarioMedicamentoDTO> findAll(Pageable pageable) {
        log.info("Obteniendo inventario paginado");
        Page<InventarioMedicamento> pageResult = inventarioRepository.findAll(pageable);
        return pageResult.map(this::convertToDTO);
    }

    public InventarioMedicamentoDTO findById(Long id) {
        log.info("Buscando inventario con ID: {}", id);
        InventarioMedicamento inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));
        return convertToDTO(inventario);
    }

    @Transactional
    public InventarioMedicamentoDTO create(InventarioMedicamentoRequestDTO request) {
        log.info("Creando nuevo registro de inventario");

        Medicamento medicamento = medicamentoRepository.findById(request.getIdMedicamento())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + request.getIdMedicamento()));

        Bodega bodega = bodegaRepository.findById(request.getIdBodega())
                .orElseThrow(() -> new ResourceNotFoundException("Bodega no encontrada con ID: " + request.getIdBodega()));

        // Verificar si ya existe inventario para este medicamento en esta bodega
        var existente = inventarioRepository.findByMedicamento_IdMedicamentoAndBodega_IdBodega(
                request.getIdMedicamento(), request.getIdBodega());

        if (existente.isPresent()) {
            throw new BusinessException("Ya existe inventario para este medicamento en esta bodega");
        }

        InventarioMedicamento inventario = new InventarioMedicamento();
        inventario.setMedicamento(medicamento);
        inventario.setBodega(bodega);
        inventario.setStockActual(request.getStockActual() != null ? request.getStockActual() : 0);
        inventario.setStockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : 0);
        inventario.setUnidadMedida(request.getUnidadMedida() != null ? request.getUnidadMedida() : medicamento.getUnidadMedida());

        InventarioMedicamento saved = inventarioRepository.save(inventario);
        log.info("Inventario creado exitosamente con ID: {}", saved.getIdInventario());
        return convertToDTO(saved);
    }

    @Transactional
    public InventarioMedicamentoDTO update(Long id, InventarioMedicamentoRequestDTO request) {
        log.info("Actualizando inventario con ID: {}", id);

        InventarioMedicamento inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));

        if (request.getStockActual() != null) {
            inventario.setStockActual(request.getStockActual());
        }

        if (request.getStockMinimo() != null) {
            inventario.setStockMinimo(request.getStockMinimo());
        }

        if (request.getUnidadMedida() != null) {
            inventario.setUnidadMedida(request.getUnidadMedida());
        }

        InventarioMedicamento updated = inventarioRepository.save(inventario);
        log.info("Inventario actualizado exitosamente: {}", id);
        return convertToDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando inventario con ID: {}", id);
        InventarioMedicamento inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));
        inventarioRepository.delete(inventario);
        log.info("Inventario eliminado exitosamente: {}", id);
    }

    @Transactional
    public InventarioMedicamentoDTO actualizarStock(Long id, Integer nuevoStock) {
        log.info("Actualizando stock del inventario {} a {}", id, nuevoStock);

        if (nuevoStock < 0) {
            throw new BusinessException("El stock no puede ser negativo");
        }

        InventarioMedicamento inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));

        inventario.setStockActual(nuevoStock);
        InventarioMedicamento updated = inventarioRepository.save(inventario);

        log.info("Stock actualizado exitosamente");
        return convertToDTO(updated);
    }

    @Transactional
    public void descontarStock(Long idMedicamento, Long idBodega, Integer cantidad) {
        log.info("Descontando {} unidades del medicamento {} en bodega {}", cantidad, idMedicamento, idBodega);

        int actualizados = inventarioRepository.descontarStock(idMedicamento, idBodega, cantidad);

        if (actualizados == 0) {
            throw new BusinessException("Stock insuficiente o medicamento no encontrado en la bodega especificada");
        }

        log.info("Stock descontado exitosamente");
    }

    public List<InventarioMedicamentoDTO> findByMedicamento(Long idMedicamento) {
        log.info("Buscando inventario del medicamento: {}", idMedicamento);
        medicamentoRepository.findById(idMedicamento)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + idMedicamento));

        List<InventarioMedicamento> inventarios = inventarioRepository.findByMedicamento_IdMedicamento(idMedicamento);
        return inventarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventarioMedicamentoDTO> findByBodega(Long idBodega) {
        log.info("Buscando inventario de la bodega: {}", idBodega);
        bodegaRepository.findById(idBodega)
                .orElseThrow(() -> new ResourceNotFoundException("Bodega no encontrada con ID: " + idBodega));

        List<InventarioMedicamento> inventarios = inventarioRepository.findByBodega_IdBodega(idBodega);
        return inventarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventarioMedicamentoDTO> findProductosConStockBajo() {
        log.info("Buscando productos con stock bajo");
        List<InventarioMedicamento> inventarios = inventarioRepository.findProductosConStockBajo();
        return inventarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventarioMedicamentoDTO> findProductosSinStock() {
        log.info("Buscando productos sin stock");
        List<InventarioMedicamento> inventarios = inventarioRepository.findProductosSinStock();
        return inventarios.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Integer getStockTotalByMedicamento(Long idMedicamento) {
        log.info("Calculando stock total del medicamento: {}", idMedicamento);
        Integer stock = inventarioRepository.getStockTotalByMedicamento(idMedicamento);
        return stock != null ? stock : 0;
    }

    private InventarioMedicamentoDTO convertToDTO(InventarioMedicamento inventario) {
        boolean necesitaReposicion = inventario.getStockActual() <= inventario.getStockMinimo();

        return InventarioMedicamentoDTO.builder()
                .idInventario(inventario.getIdInventario())
                .idMedicamento(inventario.getMedicamento().getIdMedicamento())
                .medicamentoNombre(inventario.getMedicamento().getNombreComercial())
                .medicamentoPrincipioActivo(inventario.getMedicamento().getPrincipioActivo())
                .idBodega(inventario.getBodega().getIdBodega())
                .bodegaNombre(inventario.getBodega().getNombreBodega())
                .stockActual(inventario.getStockActual())
                .stockMinimo(inventario.getStockMinimo())
                .unidadMedida(inventario.getUnidadMedida())
                .necesitaReposicion(necesitaReposicion)
                .build();
    }
}
