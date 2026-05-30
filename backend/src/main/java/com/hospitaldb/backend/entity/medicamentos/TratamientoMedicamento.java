package com.hospitaldb.backend.entity.medicamentos;

import com.hospitaldb.backend.entity.clinico.Tratamiento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tratamiento_medico", catalog ="medicamentos_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tratamiento", nullable = false)
    private Tratamiento tratamiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medicamento", nullable = false)
    private Medicamento medicamento;

    @Column(length = 100)
    private String dosis;

    private Integer cantidad;
}