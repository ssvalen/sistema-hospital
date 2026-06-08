package com.hospitaldb.backend.service.hospitalario;

import com.hospitaldb.backend.dto.request.EgresoRequestDTO;
import com.hospitaldb.backend.dto.request.IngresoRequestDTO;
import com.hospitaldb.backend.dto.response.IngresoEgresoResponseDTO;
import com.hospitaldb.backend.entity.hospitalario.Area;
import com.hospitaldb.backend.entity.hospitalario.IngresoEgreso;
import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.enums.EstadoIngreso;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.exception.ResourceNotFoundException;
import com.hospitaldb.backend.repository.clinico.IPacienteRepository;
import com.hospitaldb.backend.repository.hospitalario.IAreaRepository;
import com.hospitaldb.backend.repository.hospitalario.IIngresoEgresoRepository;
import com.hospitaldb.backend.service.auditoria.AuditService;
import com.hospitaldb.backend.utils.AuditAction;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class IngresoEgresoService {

        private final IIngresoEgresoRepository ingresoEgresoRepository;
        private final IAreaRepository areaRepository;
        private final IPacienteRepository pacienteRepository;
        private final AuditService auditService;

        public List<IngresoEgresoResponseDTO> findAll() {
                log.info("Obteniendo todas las citas");
                List<IngresoEgreso> citas = ingresoEgresoRepository.findAllByActivo(true);
                return citas.stream()
                                .map(this::toResponse)
                                .toList();
        }

        public IngresoEgresoResponseDTO findById(Long id) {
                IngresoEgreso ingresoEgreso = ingresoEgresoRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Ingreso o egreso no encontrado con ID: " + id));
                return toResponse(ingresoEgreso);
        }

        public Page<IngresoEgresoResponseDTO> findAll(Pageable pageable) {
                log.info("Obteniendo citas paginadas");
                Page<IngresoEgreso> pageResult = ingresoEgresoRepository.findAllByActivo(true, pageable);
                return pageResult.map(this::toResponse);
        }

        public IngresoEgresoResponseDTO registrarIngreso(
                        IngresoRequestDTO request,
                        HttpServletRequest httpRequest) {

                log.info("Registrando ingreso para paciente id: {}", request.getIdPaciente());

                Paciente paciente = pacienteRepository.findById(request.getIdPaciente())
                                .orElseThrow(() -> new BusinessException(
                                                "No existe el paciente con id: " + request.getIdPaciente()));

                Area area = areaRepository.findById(request.getIdArea())
                                .orElseThrow(() -> new BusinessException(
                                                "No existe el área con id: " + request.getIdArea()));

                if (ingresoEgresoRepository.existsByPacienteAndEstado(
                                paciente, EstadoIngreso.INTERNADO)) {
                        throw new BusinessException(
                                        "El paciente ya tiene un ingreso activo");
                }

                IngresoEgreso ingreso = IngresoEgreso.builder()
                                .paciente(paciente)
                                .area(area)
                                .fechaIngreso(LocalDateTime.now())
                                .motivoIngreso(request.getMotivoIngreso())
                                .observaciones(request.getObservaciones())
                                .estado(EstadoIngreso.INTERNADO)
                                .activo(true)
                                .build();

                IngresoEgreso saved = ingresoEgresoRepository.save(ingreso);

                IngresoEgreso after = copyIngreso(saved);

                auditService.log(
                                AuditAction.CREATE,
                                "IngresoEgreso",
                                String.valueOf(saved.getIdIngreso()),
                                null,
                                after,
                                null,
                                httpRequest);

                log.info("Ingreso registrado con id: {}", saved.getIdIngreso());

                return toResponse(saved);
        }

        public IngresoEgresoResponseDTO registrarEgreso(
                        Long idIngreso,
                        EgresoRequestDTO request,
                        HttpServletRequest httpRequest) {

                log.info("Registrando egreso para ingreso id: {}", idIngreso);

                IngresoEgreso ingreso = ingresoEgresoRepository.findById(idIngreso)
                                .orElseThrow(() -> new BusinessException(
                                                "No existe el ingreso con id: " + idIngreso));

                if (ingreso.getEstado() != EstadoIngreso.INTERNADO) {
                        throw new BusinessException(
                                        "El paciente ya fue dado de alta o trasladado");
                }

                IngresoEgreso before = copyIngreso(ingreso);

                ingreso.setFechaEgreso(LocalDateTime.now());
                ingreso.setMotivoEgreso(request.getMotivoEgreso());
                ingreso.setEstado(request.getEstado());
                ingreso.setObservaciones(request.getObservaciones());

                IngresoEgreso saved = ingresoEgresoRepository.save(ingreso);

                IngresoEgreso after = copyIngreso(saved);

                auditService.log(
                                AuditAction.UPDATE,
                                "IngresoEgreso",
                                String.valueOf(saved.getIdIngreso()),
                                before,
                                after,
                                null,
                                httpRequest);

                log.info("Egreso registrado para ingreso id: {}", saved.getIdIngreso());

                return toResponse(saved);
        }

        @Transactional(readOnly = true)
        public List<IngresoEgresoResponseDTO> findInternadosByArea(Long idArea) {
                return ingresoEgresoRepository
                                .findByAreaIdAreaAndEstado(idArea, EstadoIngreso.INTERNADO)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<IngresoEgresoResponseDTO> findByPaciente(Long idPaciente) {
                return ingresoEgresoRepository
                                .findByPacienteIdPacienteOrderByFechaIngresoDesc(idPaciente)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        private IngresoEgreso copyIngreso(IngresoEgreso ingreso) {
                return IngresoEgreso.builder()
                                .idIngreso(ingreso.getIdIngreso())
                                .fechaIngreso(ingreso.getFechaIngreso())
                                .fechaEgreso(ingreso.getFechaEgreso())
                                .motivoIngreso(ingreso.getMotivoIngreso())
                                .motivoEgreso(ingreso.getMotivoEgreso())
                                .estado(ingreso.getEstado())
                                .observaciones(ingreso.getObservaciones())
                                .activo(ingreso.getActivo())
                                .build();
        }

        private IngresoEgresoResponseDTO toResponse(IngresoEgreso ingreso) {
                return IngresoEgresoResponseDTO.builder()
                                .idIngreso(ingreso.getIdIngreso())
                                .idPaciente(ingreso.getPaciente().getIdPaciente())
                                .nombrePaciente(ingreso.getPaciente().getNombre())
                                .apellidoPaciente(ingreso.getPaciente().getApellido())
                                .idArea(ingreso.getArea().getIdArea())
                                .nombreArea(ingreso.getArea().getNombreArea())
                                .fechaIngreso(ingreso.getFechaIngreso() != null
                                                ? ingreso.getFechaIngreso().format(
                                                                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                                                : null)
                                .fechaEgreso(ingreso.getFechaEgreso() != null
                                                ? ingreso.getFechaEgreso().format(
                                                                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                                                : null)
                                .motivoIngreso(ingreso.getMotivoIngreso())
                                .motivoEgreso(ingreso.getMotivoEgreso())
                                .estado(ingreso.getEstado().name())
                                .observaciones(ingreso.getObservaciones())
                                .activo(ingreso.getActivo())
                                .build();
        }
}