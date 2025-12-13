package com.sweetshop.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.auth.dto.AuthResponse;
import com.sweetshop.auth.dto.LoginRequest;
import com.sweetshop.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  
  @MockBean private AuthService authService;
  
  @Test
  void register_shouldReturnAuthResponse() throws Exception {
    // Given
    RegisterRequest req = new RegisterRequest("test@example.com", "password123!");
    AuthResponse response = new AuthResponse("token123", Role.USER, "test@example.com");
    when(authService.register(any(RegisterRequest.class))).thenReturn(response);
    
    // When & Then
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").value("token123"))
        .andExpect(jsonPath("$.role").value("USER"))
        .andExpect(jsonPath("$.email").value("test@example.com"));
  }
  
  @Test
  void login_shouldReturnAuthResponse() throws Exception {
    // Given
    LoginRequest req = new LoginRequest("test@example.com", "password123!");
    AuthResponse response = new AuthResponse("token456", Role.ADMIN, "test@example.com");
    when(authService.login(any(LoginRequest.class))).thenReturn(response);
    
    // When & Then
    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(req)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").value("token456"))
        .andExpect(jsonPath("$.role").value("ADMIN"));
  }
}
