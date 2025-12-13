package com.sweetshop.sweets;

import com.sweetshop.common.ConflictException;
import com.sweetshop.common.NotFoundException;
import com.sweetshop.sweets.dto.AdjustStockRequest;
import com.sweetshop.sweets.dto.CreateSweetRequest;
import com.sweetshop.sweets.dto.SweetDto;
import com.sweetshop.sweets.dto.UpdateSweetRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SweetsServiceTest {
  @Mock private SweetRepository sweetRepository;
  
  @InjectMocks private SweetsService sweetsService;
  
  private SweetEntity testSweet;
  private UUID testSweetId;
  
  @BeforeEach
  void setUp() {
    testSweetId = UUID.randomUUID();
    testSweet = new SweetEntity();
    testSweet.id = testSweetId;
    testSweet.name = "Chocolate Bar";
    testSweet.category = "chocolate";
    testSweet.price = new BigDecimal("5.99");
    testSweet.quantity = 10;
    testSweet.createdAt = Instant.now();
    testSweet.updatedAt = Instant.now();
  }
  
  @Test
  void listAll_shouldReturnAllSweets() {
    // Given
    SweetEntity sweet2 = new SweetEntity();
    sweet2.id = UUID.randomUUID();
    sweet2.name = "Candy";
    when(sweetRepository.findAll()).thenReturn(Arrays.asList(testSweet, sweet2));
    
    // When
    List<SweetDto> result = sweetsService.listAll();
    
    // Then
    assertEquals(2, result.size());
    verify(sweetRepository).findAll();
  }
  
  @Test
  void get_shouldReturnSweet_whenExists() {
    // Given
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    SweetDto result = sweetsService.get(testSweetId);
    
    // Then
    assertNotNull(result);
    assertEquals(testSweetId, result.id());
    assertEquals("Chocolate Bar", result.name());
    verify(sweetRepository).findById(testSweetId);
  }
  
  @Test
  void get_shouldThrowNotFoundException_whenSweetDoesNotExist() {
    // Given
    UUID nonExistentId = UUID.randomUUID();
    when(sweetRepository.findById(nonExistentId)).thenReturn(Optional.empty());
    
    // When & Then
    assertThrows(NotFoundException.class, () -> sweetsService.get(nonExistentId));
  }
  
  @Test
  void create_shouldSaveNewSweet() {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("New Sweet", "candies", new BigDecimal("3.50"), 5);
    when(sweetRepository.save(any(SweetEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
    
    // When
    SweetDto result = sweetsService.create(req);
    
    // Then
    assertNotNull(result);
    assertEquals("New Sweet", result.name());
    assertEquals("candies", result.category());
    assertEquals(new BigDecimal("3.50"), result.price());
    assertEquals(5, result.quantity());
    verify(sweetRepository).save(any(SweetEntity.class));
  }
  
  @Test
  void create_shouldTrimNameAndCategory() {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("  Trimmed Name  ", "  CATEGORY  ", new BigDecimal("1.00"), 1);
    when(sweetRepository.save(any(SweetEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
    
    // When
    SweetDto result = sweetsService.create(req);
    
    // Then
    assertEquals("Trimmed Name", result.name());
    assertEquals("category", result.category());
  }
  
  @Test
  void update_shouldUpdateExistingSweet() {
    // Given
    UpdateSweetRequest req = new UpdateSweetRequest("Updated Name", "updated_category", new BigDecimal("7.99"), 20);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    SweetDto result = sweetsService.update(testSweetId, req);
    
    // Then
    assertEquals("Updated Name", result.name());
    assertEquals("updated_category", result.category());
    assertEquals(new BigDecimal("7.99"), result.price());
    assertEquals(20, result.quantity());
    verify(sweetRepository).findById(testSweetId);
  }
  
  @Test
  void update_shouldThrowNotFoundException_whenSweetDoesNotExist() {
    // Given
    UUID nonExistentId = UUID.randomUUID();
    UpdateSweetRequest req = new UpdateSweetRequest("Name", "category", new BigDecimal("1.00"), 1);
    when(sweetRepository.findById(nonExistentId)).thenReturn(Optional.empty());
    
    // When & Then
    assertThrows(NotFoundException.class, () -> sweetsService.update(nonExistentId, req));
  }
  
  @Test
  void delete_shouldDeleteSweet_whenExists() {
    // Given
    when(sweetRepository.existsById(testSweetId)).thenReturn(true);
    
    // When
    sweetsService.delete(testSweetId);
    
    // Then
    verify(sweetRepository).deleteById(testSweetId);
  }
  
  @Test
  void delete_shouldThrowNotFoundException_whenSweetDoesNotExist() {
    // Given
    UUID nonExistentId = UUID.randomUUID();
    when(sweetRepository.existsById(nonExistentId)).thenReturn(false);
    
    // When & Then
    NotFoundException exception = assertThrows(NotFoundException.class, 
        () -> sweetsService.delete(nonExistentId));
    assertEquals("Sweet not found", exception.getMessage());
    verify(sweetRepository, never()).deleteById(any());
  }
  
  @Test
  void purchase_shouldDecreaseQuantity_whenStockIsAvailable() {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(3);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    SweetDto result = sweetsService.purchase(testSweetId, req);
    
    // Then
    assertEquals(7, result.quantity());
    verify(sweetRepository).findById(testSweetId);
  }
  
  @Test
  void purchase_shouldThrowConflictException_whenStockIsInsufficient() {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(15);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When & Then
    ConflictException exception = assertThrows(ConflictException.class, 
        () -> sweetsService.purchase(testSweetId, req));
    assertEquals("Not enough stock to complete purchase", exception.getMessage());
  }
  
  @Test
  void restock_shouldIncreaseQuantity() {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(5);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    SweetDto result = sweetsService.restock(testSweetId, req);
    
    // Then
    assertEquals(15, result.quantity());
  }
  
  @Test
  void search_shouldUseSpecifications() {
    // Given
    when(sweetRepository.findAll(any(Specification.class))).thenReturn(Arrays.asList(testSweet));
    
    // When
    List<SweetDto> result = sweetsService.search("chocolate", "chocolate", new BigDecimal("1.00"), new BigDecimal("10.00"));
    
    // Then
    assertNotNull(result);
    verify(sweetRepository).findAll(any(Specification.class));
  }
  
  @Test
  void create_shouldSetTimestamps() {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("Timestamp Sweet", "candies", new BigDecimal("2.00"), 3);
    when(sweetRepository.save(any(SweetEntity.class))).thenAnswer(invocation -> {
      SweetEntity entity = invocation.getArgument(0);
      assertNotNull(entity.createdAt);
      assertNotNull(entity.updatedAt);
      return entity;
    });
    
    // When
    sweetsService.create(req);
    
    // Then
    verify(sweetRepository).save(any(SweetEntity.class));
  }
  
  @Test
  void update_shouldUpdateTimestamp() {
    // Given
    UpdateSweetRequest req = new UpdateSweetRequest("Updated", "category", new BigDecimal("5.00"), 10);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    sweetsService.update(testSweetId, req);
    
    // Then
    assertNotNull(testSweet.updatedAt);
  }
  
  @Test
  void purchase_shouldUpdateTimestamp() {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(2);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    sweetsService.purchase(testSweetId, req);
    
    // Then
    assertNotNull(testSweet.updatedAt);
  }
  
  @Test
  void restock_shouldUpdateTimestamp() {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(5);
    when(sweetRepository.findById(testSweetId)).thenReturn(Optional.of(testSweet));
    
    // When
    sweetsService.restock(testSweetId, req);
    
    // Then
    assertNotNull(testSweet.updatedAt);
  }
}
