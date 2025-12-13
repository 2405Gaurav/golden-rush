package com.sweetshop.sweets;

import com.sweetshop.common.ConflictException;
import com.sweetshop.common.NotFoundException;
import com.sweetshop.sweets.dto.AdjustStockRequest;
import com.sweetshop.sweets.dto.CreateSweetRequest;
import com.sweetshop.sweets.dto.SweetDto;
import com.sweetshop.sweets.dto.UpdateSweetRequest;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SweetsService {
  private final SweetRepository sweets;

  public SweetsService(SweetRepository sweets) {
    this.sweets = sweets;
  }

  public List<SweetDto> listAll() {
    return sweets.findAll().stream().map(SweetsService::toDto).toList();
  }

  public SweetDto get(UUID id) {
    SweetEntity s = sweets.findById(id).orElseThrow(() -> new com.sweetshop.common.NotFoundException("Sweet not found"));
    return toDto(s);
  }

  public List<SweetDto> search(String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
    Specification<SweetEntity> spec =
        Specification.where(SweetSpecifications.nameContains(name))
            .and(SweetSpecifications.categoryEquals(category))
            .and(SweetSpecifications.minPrice(minPrice))
            .and(SweetSpecifications.maxPrice(maxPrice));
    return sweets.findAll(spec).stream().map(SweetsService::toDto).toList();
  }

  @Transactional
  public SweetDto create(CreateSweetRequest req) {
    SweetEntity s = new SweetEntity();
    s.id = UUID.randomUUID();
    s.name = req.name().trim();
    s.category = req.category().trim().toLowerCase();
    s.price = req.price();
    s.quantity = req.quantity();
    s.createdAt = Instant.now();
    s.updatedAt = Instant.now();
    sweets.save(s);
    return toDto(s);
  }

  @Transactional
  public SweetDto update(UUID id, UpdateSweetRequest req) {
    SweetEntity s = sweets.findById(id).orElseThrow(() -> new NotFoundException("Sweet not found"));
    s.name = req.name().trim();
    s.category = req.category().trim().toLowerCase();
    s.price = req.price();
    s.quantity = req.quantity();
    s.updatedAt = Instant.now();
    return toDto(s);
  }

  @Transactional
  public void delete(UUID id) {
    if (!sweets.existsById(id)) throw new NotFoundException("Sweet not found");
    sweets.deleteById(id);
  }

  @Transactional
  public SweetDto purchase(UUID id, AdjustStockRequest req) {
    SweetEntity s = sweets.findById(id).orElseThrow(() -> new NotFoundException("Sweet not found"));
    if (s.quantity < req.quantity()) {
      throw new ConflictException("Not enough stock to complete purchase");
    }
    s.quantity -= req.quantity();
    s.updatedAt = Instant.now();
    return toDto(s);
  }

  @Transactional
  public SweetDto restock(UUID id, AdjustStockRequest req) {
    SweetEntity s = sweets.findById(id).orElseThrow(() -> new NotFoundException("Sweet not found"));
    s.quantity += req.quantity();
    s.updatedAt = Instant.now();
    return toDto(s);
  }

  private static SweetDto toDto(SweetEntity s) {
    return new SweetDto(s.id, s.name, s.category, s.price, s.quantity);
  }
}


