package com.contador.contador_api.service;

import com.contador.contador_api.entity.Contador;
import com.contador.contador_api.exception.ContadorException;
import com.contador.contador_api.repository.ContadorRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Service;


@Service
public class ContadorService {
    private final ContadorRepository repository;

    public ContadorService(ContadorRepository repository) {
        this.repository = repository;
    }

    public Contador buscarContador() {
        Contador contador = repository.findById(1L).orElse(null);

        if (contador == null) {
            contador = new Contador();
            contador.setValor(0);
            return repository.save(contador);
        }

        if (contador.getValor() == null) {
            contador.setValor(0);
            return repository.save(contador);
        }

        return contador;
    }

    public Contador aumentar() {
        Contador contador = buscarContador();

        if (contador == null) {
            contador = new Contador();
            contador.setValor(0);
        }

        Integer valorAtual = contador.getValor();

        if (valorAtual == null) {
            valorAtual = 0;
        }

        contador.setValor(valorAtual + 1);

        return repository.save(contador);
    }

    public Contador diminuir() {
        Contador contador = buscarContador();

        if (contador == null) {
            contador = new Contador();
            contador.setValor(0);
        }

        Integer valorAtual = contador.getValor();

        if (valorAtual == null) {
            valorAtual = 0;
        }

        if (valorAtual == 0){
            throw new ContadorException("Não é possível diminuir. Contador já está zerado.");
        }

        if (valorAtual > 0) {
            contador.setValor(valorAtual - 1);
        }

        return repository.save(contador);
    }

    public Contador resetar() {

        Contador contador = buscarContador();

        if (contador == null) {
            contador = new Contador();
        }

        contador.setValor(0);

        return repository.save(contador);
    }
}

