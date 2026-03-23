package com.contador.contador_api.dto;

public class ContadorResponseDTO {

    private Integer valor;

    public ContadorResponseDTO(Integer valor) {
        this.valor = valor;
    }

    public Integer getValor() {
        return valor;
    }
}
