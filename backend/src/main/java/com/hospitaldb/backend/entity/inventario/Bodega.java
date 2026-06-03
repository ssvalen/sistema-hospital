package com.hospitaldb.backend.entity.inventario;

import com.hospitaldb.backend.entity.common.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bodega", catalog ="inventario_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Bodega extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bodega")
    private Long idBodega;

    @Column(name = "nombre_bodega", nullable = false, length = 100)
    private String nombreBodega;

    @Column(length = 200)
    private String ubicacion;

    @OneToMany(mappedBy = "bodega", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<InventarioMedicamento> inventarios = new ArrayList<>();

    public void addInventario(InventarioMedicamento inventario) {
        inventarios.add(inventario);
        inventario.setBodega(this);
    }
}
