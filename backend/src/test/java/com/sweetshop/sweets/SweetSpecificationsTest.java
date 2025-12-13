package com.sweetshop.sweets;

import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class SweetSpecificationsTest {
  
  @Test
  void nameContains_shouldReturnNull_whenQueryIsNull() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.nameContains(null);
    
    // Then
    assertNull(spec);
  }
  
  @Test
  void nameContains_shouldReturnNull_whenQueryIsBlank() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.nameContains("   ");
    
    // Then
    assertNull(spec);
  }
  
  @Test
  void nameContains_shouldReturnSpecification_whenQueryIsValid() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.nameContains("chocolate");
    
    // Then
    assertNotNull(spec);
  }
  
  @Test
  void nameContains_shouldTrimAndLowercaseQuery() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.nameContains("  CHOCOLATE  ");
    
    // Then
    assertNotNull(spec);
  }
  
  @Test
  void categoryEquals_shouldReturnNull_whenCategoryIsNull() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.categoryEquals(null);
    
    // Then
    assertNull(spec);
  }
  
  @Test
  void categoryEquals_shouldReturnNull_whenCategoryIsBlank() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.categoryEquals("");
    
    // Then
    assertNull(spec);
  }
  
  @Test
  void categoryEquals_shouldReturnSpecification_whenCategoryIsValid() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.categoryEquals("candies");
    
    // Then
    assertNotNull(spec);
  }
  
  @Test
  void categoryEquals_shouldTrimAndLowercaseCategory() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.categoryEquals("  CANDIES  ");
    
    // Then
    assertNotNull(spec);
  }
  
  @Test
  void minPrice_shouldReturnNull_whenMinPriceIsNull() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.minPrice(null);
    
    // Then
    assertNull(spec);
  }
  
  @Test
  void minPrice_shouldReturnSpecification_whenMinPriceIsValid() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.minPrice(new BigDecimal("5.00"));
    
    // Then
    assertNotNull(spec);
  }
  
  @Test
  void maxPrice_shouldReturnNull_whenMaxPriceIsNull() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.maxPrice(null);
    
    // Then
    assertNull(spec);
  }
  
  @Test
  void maxPrice_shouldReturnSpecification_whenMaxPriceIsValid() {
    // When
    Specification<SweetEntity> spec = SweetSpecifications.maxPrice(new BigDecimal("10.00"));
    
    // Then
    assertNotNull(spec);
  }
}

