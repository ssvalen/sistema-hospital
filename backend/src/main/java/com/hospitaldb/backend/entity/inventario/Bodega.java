package com.hospitaldb.backend.entity.inventario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bodega", catalog ="inventario_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bodega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bodega")
    private Long idBodega;

    @Column(name = "nombre_bodega", nullable = false, length = 100)
    private String nombreBodega;

    @Column(length = 200)
    private String ubicacion;

    @OneToMany(mappedBy = "bodega", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InventarioMedicamento> inventarios = new ArrayList<>();

    public void addInventario(InventarioMedicamento inventario) {
        inventarios.add(inventario);
        inventario.setBodega(this);
    }
}
