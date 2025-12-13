package com.sweetshop.sweets;

import com.sweetshop.sweets.dto.AdjustStockRequest;
import com.sweetshop.sweets.dto.CreateSweetRequest;
import com.sweetshop.sweets.dto.SweetDto;
import com.sweetshop.sweets.dto.UpdateSweetRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sweets")
public class SweetsController {
  private final SweetsService sweets;

  public SweetsController(SweetsService sweets) {
    this.sweets = sweets;
  }

  @GetMapping
  public List<SweetDto> list() {
    return sweets.listAll();
  }

  @GetMapping("/{id}")
  public SweetDto get(@PathVariable UUID id) {
    return sweets.get(id);
  }

  @GetMapping("/search")
  public List<SweetDto> search(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice) {
    return sweets.search(name, category, minPrice, maxPrice);
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public SweetDto create(@Valid @RequestBody CreateSweetRequest req) {
    return sweets.create(req);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public SweetDto update(@PathVariable UUID id, @Valid @RequestBody UpdateSweetRequest req) {
    return sweets.update(id, req);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public void delete(@PathVariable UUID id) {
    sweets.delete(id);
  }

  @PostMapping("/{id}/purchase")
  public SweetDto purchase(@PathVariable UUID id, @Valid @RequestBody AdjustStockRequest req) {
    return sweets.purchase(id, req);
  }

  @PostMapping("/{id}/restock")
  @PreAuthorize("hasRole('ADMIN')")
  public SweetDto restock(@PathVariable UUID id, @Valid @RequestBody AdjustStockRequest req) {
    return sweets.restock(id, req);
  }
}


