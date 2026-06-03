package com.hospitaldb.backend.entity.clinico;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospitaldb.backend.entity.common.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cita", catalog = "clinico_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Cita extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita")
    private Long idCita;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(length = 50)
    private String estado;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    @ToString.Exclude
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    @ToString.Exclude
    private Medico medico;

    @OneToMany(mappedBy = "cita", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tratamiento> tratamientos = new ArrayList<>();

}
