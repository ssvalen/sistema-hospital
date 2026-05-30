package com.hospitaldb.backend.entity.clinico;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tratamiento", catalog ="clinico_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tratamiento {

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
    private Cita cita;

    @OneToMany(mappedBy = "tratamiento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento> tratamientoMedicamentos = new ArrayList<>();

    public void addTratamientoMedicamento(com.hospitaldb.backend.entity.medicamentos.TratamientoMedicamento tm) {
        tratamientoMedicamentos.add(tm);
        tm.setTratamiento(this);
    }
}
