package com.sweetshop.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Base64;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
  private JwtService jwtService;
  private JwtProperties jwtProperties;
  private String validSecretBase64;
  
  @BeforeEach
  void setUp() {
    validSecretBase64 = Base64.getEncoder().encodeToString("0123456789abcdef0123456789abcdef".getBytes());
    jwtProperties = new JwtProperties(validSecretBase64, "test-issuer", 3600L);
    jwtService = new JwtService(jwtProperties);
  }
  
  @Test
  void createAccessToken_shouldGenerateValidToken() {
    // Given
    UUID userId = UUID.randomUUID();
    String email = "test@example.com";
    Role role = Role.USER;
    
    // When
    String token = jwtService.createAccessToken(userId, email, role);
    
    // Then
    assertNotNull(token);
    assertFalse(token.isEmpty());
  }
  
  @Test
  void createAccessToken_shouldIncludeUserIdInSubject() {
    // Given
    UUID userId = UUID.randomUUID();
    String email = "test@example.com";
    Role role = Role.USER;
    
    // When
    String token = jwtService.createAccessToken(userId, email, role);
    Claims claims = jwtService.parse(token);
    
    // Then
    assertEquals(userId.toString(), claims.getSubject());
  }
  
  @Test
  void createAccessToken_shouldIncludeEmailAndRoleInClaims() {
    // Given
    UUID userId = UUID.randomUUID();
    String email = "test@example.com";
    Role role = Role.ADMIN;
    
    // When
    String token = jwtService.createAccessToken(userId, email, role);
    Claims claims = jwtService.parse(token);
    
    // Then
    assertEquals(email, claims.get("email"));
    assertEquals("ADMIN", claims.get("role"));
  }
  
  @Test
  void parse_shouldReturnClaims_whenTokenIsValid() {
    // Given
    UUID userId = UUID.randomUUID();
    String token = jwtService.createAccessToken(userId, "test@example.com", Role.USER);
    
    // When
    Claims claims = jwtService.parse(token);
    
    // Then
    assertNotNull(claims);
    assertEquals(userId.toString(), claims.getSubject());
  }
  
  @Test
  void parse_shouldThrowException_whenTokenIsInvalid() {
    // Given
    String invalidToken = "invalid.token.here";
    
    // When & Then
    assertThrows(JwtException.class, () -> jwtService.parse(invalidToken));
  }
  
  @Test
  void parse_shouldThrowException_whenTokenHasWrongIssuer() {
    // Given
    UUID userId = UUID.randomUUID();
    String token = jwtService.createAccessToken(userId, "test@example.com", Role.USER);
    
    // Create service with different issuer
    JwtProperties wrongIssuerProps = new JwtProperties(validSecretBase64, "wrong-issuer", 3600L);
    JwtService wrongIssuerService = new JwtService(wrongIssuerProps);
    
    // When & Then
    assertThrows(JwtException.class, () -> wrongIssuerService.parse(token));
  }
  
  @Test
  void constructor_shouldThrowException_whenSecretIsNull() {
    // Given
    JwtProperties nullSecretProps = new JwtProperties(null, "issuer", 3600L);
    
    // When & Then
    assertThrows(IllegalStateException.class, () -> new JwtService(nullSecretProps));
  }
  
  @Test
  void constructor_shouldThrowException_whenSecretIsBlank() {
    // Given
    JwtProperties blankSecretProps = new JwtProperties("   ", "issuer", 3600L);
    
    // When & Then
    assertThrows(IllegalStateException.class, () -> new JwtService(blankSecretProps));
  }
}
