package com.basketball_camps.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.basketball_camps.model.BaseEntity;
import com.basketball_camps.service.BasicServiceOperations;
import com.basketball_camps.validation.group.Create;
import com.basketball_camps.validation.group.Update;

import jakarta.validation.groups.Default;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public abstract class BasicControllerOperations<S extends BasicServiceOperations<?, E>, E extends BaseEntity> {

  protected final S service;

  @GetMapping("/{id}")
  public E findById(@PathVariable Long id) {
    return service.findById(id);
  }

  @GetMapping("/all")
  public List<E> findAll() {
    return service.findAll();
  }

  @PostMapping
  public E create(@RequestBody E entity) {
    return service.save(entity);
  }

  @PutMapping
  public E update(@RequestBody @Validated({ Default.class, Update.class }) E entity) {
    return service.save(entity);
  }

  @PostMapping("/validate")
  public void validateOnCreate(@RequestBody @Validated({ Default.class, Create.class }) E entity) {
  }

  @PutMapping("/validate")
  public void validateOnUpdate(@RequestBody @Validated({ Default.class, Update.class }) E entity) {
  }

  @DeleteMapping("/{id}")
  public void deleteById(@PathVariable Long id) {
    service.deleteById(id);
  }
}
