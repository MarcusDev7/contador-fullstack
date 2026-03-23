package com.contador.contador_api.exception;

public class ContadorException extends RuntimeException {

    public ContadorException(String mensagem) {
        super(mensagem);
    }
}