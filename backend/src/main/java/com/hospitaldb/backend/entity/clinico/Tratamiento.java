package com.hospitaldb.backend.entity.clinico;

import com.hospitaldb.backend.entity.common.BaseAuditableEntity;
import com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tratamiento", catalog ="clinico_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Tratamiento extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tratamiento")
    private Long idTratamiento;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cita", nullable = false)
    @ToString.Exclude
    private Cita cita;

    @OneToMany(mappedBy = "tratamiento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<TratamientoMedicamento> tratamientoMedicamentos = new ArrayList<>();

    public void addTratamientoMedicamento(TratamientoMedicamento tm) {
        tratamientoMedicamentos.add(tm);
        tm.setTratamiento(this);
    }
}
