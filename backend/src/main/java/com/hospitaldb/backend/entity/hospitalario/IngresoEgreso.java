package com.hospitaldb.backend.entity.hospitalario;

import com.hospitaldb.backend.entity.clinico.Paciente;
import com.hospitaldb.backend.entity.common.BaseAuditableEntity;
import com.hospitaldb.backend.enums.EstadoIngreso;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ingreso_egreso", catalog = "hospitalario_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngresoEgreso extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingreso")
    private Long idIngreso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    @ToString.Exclude
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area", nullable = false)
    @ToString.Exclude
    private Area area;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;

    @Column(name = "fecha_egreso")
    private LocalDateTime fechaEgreso;

    @Column(name = "motivo_ingreso", columnDefinition = "TEXT")
    private String motivoIngreso;

    @Column(name = "motivo_egreso", columnDefinition = "TEXT")
    private String motivoEgreso;

    @Column(length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoIngreso estado = EstadoIngreso.INTERNADO;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(nullable = false)
    private Boolean activo = true;
}
