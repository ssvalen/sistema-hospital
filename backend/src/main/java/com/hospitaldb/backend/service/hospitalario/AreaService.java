package com.hospitaldb.backend.service.hospitalario;

import com.hospitaldb.backend.dto.request.AreaRequestDTO;
import com.hospitaldb.backend.dto.response.AreaResponseDTO;
import com.hospitaldb.backend.entity.hospitalario.Area;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.repository.hospitalario.IAreaRepository;
import com.hospitaldb.backend.service.auditoria.AuditService;
import com.hospitaldb.backend.utils.AuditAction;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AreaService {

    private final IAreaRepository areaRepository;
    private final ModelMapper modelMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<AreaResponseDTO> findAll() {
        return areaRepository.findAll()
                .stream()
                .map(area -> modelMapper.map(area, AreaResponseDTO.class))
                .toList();
    }

    @Transactional(readOnly = true)
    public AreaResponseDTO findById(Long id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "No existe el área con id: " + id));
        return modelMapper.map(area, AreaResponseDTO.class);
    }

    public AreaResponseDTO create(AreaRequestDTO request, HttpServletRequest httpRequest) {
        log.info("Creando área: {}", request.getNombreArea());

        if (areaRepository.existsByNombreArea(request.getNombreArea())) {
            throw new BusinessException(
                    "Ya existe un área con el nombre: " + request.getNombreArea());
        }

        Area area = modelMapper.map(request, Area.class);
        Area saved = areaRepository.save(area);
        log.info("Área creada con id: {}", saved.getIdArea());

        auditService.log(
                AuditAction.CREATE, "Area",
                String.valueOf(saved.getIdArea()),
                null,
                saved.toString(),
                null,
                httpRequest
        );

        return modelMapper.map(saved, AreaResponseDTO.class);
    }

    public AreaResponseDTO update(
            Long id, AreaRequestDTO request, HttpServletRequest httpRequest) {
        log.info("Actualizando área id: {}", id);

        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "No existe el área con id: " + id));

        Area before = Area.builder()
                .idArea(area.getIdArea())
                .nombreArea(area.getNombreArea())
                .descripcion(area.getDescripcion())
                .capacidad(area.getCapacidad())
                .build();

        area.setNombreArea(request.getNombreArea());
        area.setDescripcion(request.getDescripcion());
        area.setCapacidad(request.getCapacidad());

        Area saved = areaRepository.save(area);

        auditService.log(
                AuditAction.UPDATE, "Area",
                String.valueOf(saved.getIdArea()),
                before.toString(),
                saved.toString(),
                null,
                httpRequest
        );

        return modelMapper.map(saved, AreaResponseDTO.class);
    }

    public void delete(Long id, HttpServletRequest httpRequest) {
        log.info("Eliminando área id: {}", id);

        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "No existe el área con id: " + id));

        area.setActivo(false);
        areaRepository.save(area);

        auditService.log(
                AuditAction.DELETE, "Area",
                String.valueOf(id),
                area.toString(),
                null,
                null,
                httpRequest
        );
    }
}