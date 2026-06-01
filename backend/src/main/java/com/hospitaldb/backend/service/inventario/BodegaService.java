package com.hospitaldb.backend.service.inventario;

import com.hospitaldb.backend.dto.request.BodegaRequestDTO;
import com.hospitaldb.backend.dto.response.inventario.BodegaDTO;
import com.hospitaldb.backend.entity.inventario.Bodega;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.inventario.IBodegaRepository;
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
public class BodegaService {
    private final IBodegaRepository bodegaRepository;

    private final ModelMapper modelMapper;

    public List<BodegaDTO> findAll() {
        log.info("Obteniendo todas las bodegas");
        List<Bodega> bodegas = bodegaRepository.findAll();
        return bodegas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<BodegaDTO> findAll(Pageable pageable) {
        log.info("Obteniendo bodegas paginadas");
        Page<Bodega> pageResult = bodegaRepository.findAll(pageable);
        return pageResult.map(this::convertToDTO);
    }

    public BodegaDTO findById(Long id) {
        log.info("Buscando bodega con ID: {}", id);
        Bodega bodega = bodegaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bodega no encontrada con ID: " + id));
        return convertToDTO(bodega);
    }

    @Transactional
    public BodegaDTO create(BodegaRequestDTO request) {
        log.info("Creando nueva bodega: {}", request.getNombreBodega());

        if (bodegaRepository.existsByNombreBodega(request.getNombreBodega())) {
            throw new BusinessException("Ya existe una bodega con el nombre: " + request.getNombreBodega());
        }

        Bodega bodega = new Bodega();
        bodega.setNombreBodega(request.getNombreBodega());
        bodega.setUbicacion(request.getUbicacion());

        Bodega saved = bodegaRepository.save(bodega);
        log.info("Bodega creada exitosamente con ID: {}", saved.getIdBodega());
        return convertToDTO(saved);
    }

    @Transactional
    public BodegaDTO update(Long id, BodegaRequestDTO request) {
        log.info("Actualizando bodega con ID: {}", id);

        Bodega bodega = bodegaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bodega no encontrada con ID: " + id));

        if (!bodega.getNombreBodega().equals(request.getNombreBodega()) &&
                bodegaRepository.existsByNombreBodega(request.getNombreBodega())) {
            throw new BusinessException("Ya existe una bodega con el nombre: " + request.getNombreBodega());
        }

        bodega.setNombreBodega(request.getNombreBodega());
        bodega.setUbicacion(request.getUbicacion());

        Bodega updated = bodegaRepository.save(bodega);
        log.info("Bodega actualizada exitosamente: {}", id);
        return convertToDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando bodega con ID: {}", id);
        Bodega bodega = bodegaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bodega no encontrada con ID: " + id));

        if (!bodega.getInventarios().isEmpty()) {
            throw new BusinessException("No se puede eliminar una bodega que tiene inventario asociado");
        }

        bodegaRepository.delete(bodega);
        log.info("Bodega eliminada exitosamente: {}", id);
    }

    public List<BodegaDTO> findBodegasConInventario() {
        log.info("Obteniendo bodegas con inventario");
        List<Bodega> bodegas = bodegaRepository.findBodegasConInventario();
        return bodegas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BodegaDTO> findBodegasSinInventario() {
        log.info("Obteniendo bodegas sin inventario");
        List<Bodega> bodegas = bodegaRepository.findBodegasSinInventario();
        return bodegas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BodegaDTO convertToDTO(Bodega bodega) {
        return BodegaDTO.builder()
                .idBodega(bodega.getIdBodega())
                .nombreBodega(bodega.getNombreBodega())
                .ubicacion(bodega.getUbicacion())
                .cantidadProductos(bodega.getInventarios() != null ? bodega.getInventarios().size() : 0)
                .build();
    }
}
