package com.sweetshop.sweets;

import java.math.BigDecimal;
import org.springframework.data.jpa.domain.Specification;

public final class SweetSpecifications {
  private SweetSpecifications() {}

  public static Specification<SweetEntity> nameContains(String q) {
    if (q == null || q.isBlank()) return null;
    String like = "%" + q.trim().toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("name")), like);
  }

  public static Specification<SweetEntity> categoryEquals(String category) {
    if (category == null || category.isBlank()) return null;
    String c = category.trim().toLowerCase();
    return (root, query, cb) -> cb.equal(cb.lower(root.get("category")), c);
  }

  public static Specification<SweetEntity> minPrice(BigDecimal min) {
    if (min == null) return null;
    return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), min);
  }

  public static Specification<SweetEntity> maxPrice(BigDecimal max) {
    if (max == null) return null;
    return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), max);
  }
}





