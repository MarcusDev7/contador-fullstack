package com.contador.contador_api.exception;

import com.contador.contador_api.dto.ErroResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ContadorException.class)
    public ResponseEntity<ErroResponseDTO> handleContadorException(ContadorException ex) {

        ErroResponseDTO erro = new ErroResponseDTO(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(erro);
    }
}