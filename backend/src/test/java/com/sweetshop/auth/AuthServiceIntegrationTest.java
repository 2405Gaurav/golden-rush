package com.sweetshop.auth;

import com.sweetshop.auth.dto.AuthResponse;
import com.sweetshop.auth.dto.LoginRequest;
import com.sweetshop.auth.dto.RegisterRequest;
import com.sweetshop.common.ConflictException;
import com.sweetshop.testcontainers.PostgresTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceIntegrationTest extends PostgresTestBase {
  @Autowired private AuthService authService;
  @Autowired private UserRepository userRepository;
  
  @Test
  void registerAndLogin_integrationTest() {
    // Given
    RegisterRequest registerReq = new RegisterRequest("integration@test.com", "password123!");
    
    // When
    AuthResponse registerResponse = authService.register(registerReq);
    
    // Then
    assertNotNull(registerResponse.accessToken());
    assertEquals(Role.USER, registerResponse.role());
    assertEquals("integration@test.com", registerResponse.email());
    
    // When - Login
    LoginRequest loginReq = new LoginRequest("integration@test.com", "password123!");
    AuthResponse loginResponse = authService.login(loginReq);
    
    // Then
    assertNotNull(loginResponse.accessToken());
    assertEquals("integration@test.com", loginResponse.email());
  }
  
  @Test
  void registerDuplicateEmail_throwsConflictException_integrationTest() {
    // Given
    RegisterRequest req1 = new RegisterRequest("duplicate@test.com", "password123!");
    authService.register(req1);
    
    // When & Then
    RegisterRequest req2 = new RegisterRequest("duplicate@test.com", "password456!");
    assertThrows(ConflictException.class, () -> authService.register(req2));
  }
}
