package com.contador.contador_api.repository;

import com.contador.contador_api.entity.Contador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContadorRepository extends JpaRepository<Contador, Long> {
}