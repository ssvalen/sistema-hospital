package com.hospitaldb.backend.service.inventario;

import com.hospitaldb.backend.dto.request.BodegaRequestDTO;
import com.hospitaldb.backend.entity.inventario.Bodega;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.inventario.IBodegaRepository;
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
public class BodegaService {
    private final IBodegaRepository bodegaRepository;

    public List<Bodega> findAll() {
        log.info("Obteniendo todas las bodegas");
        return bodegaRepository.findAll();
    }

    public Page<Bodega> findAll(Pageable pageable) {
        log.info("Obteniendo bodegas paginadas");
        return bodegaRepository.findAll(pageable);
    }

    public Bodega findById(Long id) {
        log.info("Buscando bodega con ID: {}", id);
        return bodegaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bodega no encontrada con ID: " + id));
    }

    @Transactional
    public Bodega create(BodegaRequestDTO request) {
        log.info("Creando nueva bodega: {}", request.getNombreBodega());

        if (bodegaRepository.existsByNombreBodega(request.getNombreBodega())) {
            throw new BusinessException("Ya existe una bodega con el nombre: " + request.getNombreBodega());
        }

        Bodega bodega = new Bodega();
        bodega.setNombreBodega(request.getNombreBodega());
        bodega.setUbicacion(request.getUbicacion());

        Bodega saved = bodegaRepository.save(bodega);
        log.info("Bodega creada exitosamente con ID: {}", saved.getIdBodega());
        return saved;
    }

    @Transactional
    public Bodega update(Long id, BodegaRequestDTO request) {
        log.info("Actualizando bodega con ID: {}", id);

        Bodega bodega = findById(id);

        if (!bodega.getNombreBodega().equals(request.getNombreBodega()) &&
                bodegaRepository.existsByNombreBodega(request.getNombreBodega())) {
            throw new BusinessException("Ya existe una bodega con el nombre: " + request.getNombreBodega());
        }

        bodega.setNombreBodega(request.getNombreBodega());
        bodega.setUbicacion(request.getUbicacion());

        Bodega updated = bodegaRepository.save(bodega);
        log.info("Bodega actualizada exitosamente: {}", id);
        return updated;
    }

    @Transactional
    public void delete(Long id) {
        log.info("Eliminando bodega con ID: {}", id);
        Bodega bodega = findById(id);

        if (!bodega.getInventarios().isEmpty()) {
            throw new BusinessException("No se puede eliminar una bodega que tiene inventario asociado");
        }

        bodegaRepository.delete(bodega);
        log.info("Bodega eliminada exitosamente: {}", id);
    }

    public List<Bodega> findBodegasConInventario() {
        log.info("Obteniendo bodegas con inventario");
        return bodegaRepository.findBodegasConInventario();
    }

    public List<Bodega> findBodegasSinInventario() {
        log.info("Obteniendo bodegas sin inventario");
        return bodegaRepository.findBodegasSinInventario();
    }
}
