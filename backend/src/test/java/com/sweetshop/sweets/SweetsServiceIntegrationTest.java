package com.sweetshop.sweets;

import com.sweetshop.common.ConflictException;
import com.sweetshop.common.NotFoundException;
import com.sweetshop.sweets.dto.AdjustStockRequest;
import com.sweetshop.sweets.dto.CreateSweetRequest;
import com.sweetshop.sweets.dto.SweetDto;
import com.sweetshop.testcontainers.PostgresTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SweetsServiceIntegrationTest extends PostgresTestBase {
  @Autowired private SweetsService sweetsService;
  @Autowired private SweetRepository sweetRepository;
  
  @Test
  void createAndRetrieveSweet_integrationTest() {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("Integration Test Sweet", "candies", new BigDecimal("2.50"), 5);
    
    // When
    SweetDto created = sweetsService.create(req);
    SweetDto retrieved = sweetsService.get(created.id());
    
    // Then
    assertNotNull(created.id());
    assertEquals("Integration Test Sweet", retrieved.name());
    assertEquals("candies", retrieved.category());
    assertEquals(new BigDecimal("2.50"), retrieved.price());
    assertEquals(5, retrieved.quantity());
  }
  
  @Test
  void purchaseReducesStock_integrationTest() {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("Stock Test", "chocolate", new BigDecimal("3.00"), 10);
    SweetDto created = sweetsService.create(req);
    
    // When
    AdjustStockRequest purchaseReq = new AdjustStockRequest(3);
    SweetDto afterPurchase = sweetsService.purchase(created.id(), purchaseReq);
    
    // Then
    assertEquals(7, afterPurchase.quantity());
  }
  
  @Test
  void purchaseThrowsException_whenStockInsufficient_integrationTest() {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("Low Stock", "candies", new BigDecimal("1.00"), 2);
    SweetDto created = sweetsService.create(req);
    
    // When & Then
    AdjustStockRequest purchaseReq = new AdjustStockRequest(5);
    assertThrows(ConflictException.class, () -> sweetsService.purchase(created.id(), purchaseReq));
  }
}
