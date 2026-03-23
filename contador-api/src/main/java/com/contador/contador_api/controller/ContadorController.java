package com.contador.contador_api.controller;

import com.contador.contador_api.dto.ContadorResponseDTO;
import com.contador.contador_api.entity.Contador;
import com.contador.contador_api.service.ContadorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contador")
@CrossOrigin(origins = "http://localhost:5173")
public class ContadorController {
    private final ContadorService service;

    public ContadorController(ContadorService service) {
        this.service = service;
    }

    @GetMapping
    public ContadorResponseDTO buscar() {
        Contador contador = service.buscarContador();
        return new ContadorResponseDTO(contador.getValor());
    }

    @PostMapping("/aumentar")
    public ContadorResponseDTO aumentar(){
        Contador contador = service.aumentar();
        return new ContadorResponseDTO(contador.getValor());
    }

    @PostMapping("/diminuir")
    public ContadorResponseDTO diminuir(){
        Contador contador = service.diminuir();
        return new ContadorResponseDTO(contador.getValor());
    }

    @PostMapping("/resetar")
    public ContadorResponseDTO resetar(){
        Contador contador = service.resetar();
        return new ContadorResponseDTO(contador.getValor());
    }
}