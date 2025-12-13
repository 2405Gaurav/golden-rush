package com.sweetshop.sweets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.sweets.dto.AdjustStockRequest;
import com.sweetshop.sweets.dto.CreateSweetRequest;
import com.sweetshop.sweets.dto.SweetDto;
import com.sweetshop.sweets.dto.UpdateSweetRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SweetsController.class)
class SweetsControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  
  @MockBean private SweetsService sweetsService;
  
  private UUID testId = UUID.randomUUID();
  
  @Test
  @WithMockUser
  void list_shouldReturnAllSweets() throws Exception {
    // Given
    SweetDto sweet1 = new SweetDto(testId, "Sweet1", "candies", new BigDecimal("1.00"), 10);
    SweetDto sweet2 = new SweetDto(UUID.randomUUID(), "Sweet2", "chocolate", new BigDecimal("2.00"), 5);
    when(sweetsService.listAll()).thenReturn(Arrays.asList(sweet1, sweet2));
    
    // When & Then
    mockMvc.perform(get("/api/sweets"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2));
  }
  
  @Test
  @WithMockUser
  void get_shouldReturnSweetById() throws Exception {
    // Given
    SweetDto sweet = new SweetDto(testId, "Test Sweet", "candies", new BigDecimal("3.50"), 5);
    when(sweetsService.get(testId)).thenReturn(sweet);
    
    // When & Then
    mockMvc.perform(get("/api/sweets/" + testId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(testId.toString()))
        .andExpect(jsonPath("$.name").value("Test Sweet"));
  }
  
  @Test
  @WithMockUser(roles = "ADMIN")
  void create_shouldCreateNewSweet() throws Exception {
    // Given
    CreateSweetRequest req = new CreateSweetRequest("New Sweet", "candies", new BigDecimal("5.00"), 10);
    SweetDto response = new SweetDto(testId, "New Sweet", "candies", new BigDecimal("5.00"), 10);
    when(sweetsService.create(any(CreateSweetRequest.class))).thenReturn(response);
    
    // When & Then
    mockMvc.perform(post("/api/sweets")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("New Sweet"));
  }
  
  @Test
  @WithMockUser(roles = "ADMIN")
  void update_shouldUpdateSweet() throws Exception {
    // Given
    UpdateSweetRequest req = new UpdateSweetRequest("Updated", "chocolate", new BigDecimal("7.00"), 15);
    SweetDto response = new SweetDto(testId, "Updated", "chocolate", new BigDecimal("7.00"), 15);
    when(sweetsService.update(any(UUID.class), any(UpdateSweetRequest.class))).thenReturn(response);
    
    // When & Then
    mockMvc.perform(put("/api/sweets/" + testId)
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Updated"));
  }
  
  @Test
  @WithMockUser(roles = "ADMIN")
  void delete_shouldDeleteSweet() throws Exception {
    // When & Then
    mockMvc.perform(delete("/api/sweets/" + testId)
            .with(csrf()))
        .andExpect(status().isOk());
  }
  
  @Test
  @WithMockUser
  void purchase_shouldDecreaseStock() throws Exception {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(2);
    SweetDto response = new SweetDto(testId, "Sweet", "candies", new BigDecimal("1.00"), 8);
    when(sweetsService.purchase(any(UUID.class), any(AdjustStockRequest.class))).thenReturn(response);
    
    // When & Then
    mockMvc.perform(post("/api/sweets/" + testId + "/purchase")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.quantity").value(8));
  }
  
  @Test
  @WithMockUser(roles = "ADMIN")
  void restock_shouldIncreaseStock() throws Exception {
    // Given
    AdjustStockRequest req = new AdjustStockRequest(5);
    SweetDto response = new SweetDto(testId, "Sweet", "candies", new BigDecimal("1.00"), 15);
    when(sweetsService.restock(any(UUID.class), any(AdjustStockRequest.class))).thenReturn(response);
    
    // When & Then
    mockMvc.perform(post("/api/sweets/" + testId + "/restock")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.quantity").value(15));
  }
}
