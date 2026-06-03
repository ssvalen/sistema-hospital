package com.hospitaldb.backend.entity.hospitalario;

import com.hospitaldb.backend.entity.common.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "area", catalog = "hospitalario_db")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Area extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_area")
    private Long idArea;

    @Column(name = "nombre_area", nullable = false, unique = true, length = 100)
    private String nombreArea;

    @Column(length = 200)
    private String descripcion;

    private Integer capacidad;

    @Column(nullable = false)
    private Boolean activo = true;

    @OneToMany(mappedBy = "area", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<IngresoEgreso> ingresos = new ArrayList<>();
}