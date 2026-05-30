package com.hospitaldb.backend.entity.medicamentos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medicamento", catalog = "medicamentos_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medicamento")
    private Long idMedicamento;

    @Column(name = "nombre_comercial", nullable = false, length = 200)
    private String nombreComercial;

    @Column(name = "principio_activo", length = 200)
    private String principioActivo;

    @Column(name = "unidad_medida", length = 50)
    private String unidadMedida;

    // Relación con TRATAMIENTO_MEDICAMENTO
    @OneToMany(mappedBy = "medicamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TratamientoMedicamento> tratamientoMedicamentos = new ArrayList<>();

    // Relación con INVENTARIO_MEDICAMENTO (desde esquema inventario_db)
    @OneToMany(mappedBy = "medicamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.hospitaldb.backend.entity.inventario.InventarioMedicamento> inventarios = new ArrayList<>();

    // Métodos helper
    public void addTratamientoMedicamento(TratamientoMedicamento tm) {
        tratamientoMedicamentos.add(tm);
        tm.setMedicamento(this);
    }

    public void addInventario(com.hospitaldb.backend.entity.inventario.InventarioMedicamento inventario) {
        inventarios.add(inventario);
        inventario.setMedicamento(this);
    }
}
