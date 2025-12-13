package com.sweetshop.auth;

import com.sweetshop.auth.dto.AuthResponse;
import com.sweetshop.auth.dto.LoginRequest;
import com.sweetshop.auth.dto.RegisterRequest;
import com.sweetshop.common.ConflictException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
  @Mock private UserRepository userRepository;
  @Mock private PasswordEncoder passwordEncoder;
  @Mock private AuthenticationManager authenticationManager;
  @Mock private JwtService jwtService;
  
  @InjectMocks private AuthService authService;
  
  private UserEntity testUser;
  private UUID testUserId;
  
  @BeforeEach
  void setUp() {
    testUserId = UUID.randomUUID();
    testUser = new UserEntity();
    testUser.id = testUserId;
    testUser.email = "test@example.com";
    testUser.passwordHash = "encodedPassword";
    testUser.role = Role.USER;
  }
  
  @Test
  void register_shouldCreateNewUser_whenEmailNotExists() {
    // Given
    RegisterRequest req = new RegisterRequest("newuser@example.com", "password123!");
    when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(jwtService.createAccessToken(any(), anyString(), any())).thenReturn("testToken");
    
    // When
    AuthResponse response = authService.register(req);
    
    // Then
    assertNotNull(response);
    assertEquals("testToken", response.accessToken());
    assertEquals(Role.USER, response.role());
    verify(userRepository).save(any(UserEntity.class));
    verify(jwtService).createAccessToken(any(), eq("newuser@example.com"), eq(Role.USER));
  }
  
  @Test
  void register_shouldThrowConflictException_whenEmailAlreadyExists() {
    // Given
    RegisterRequest req = new RegisterRequest("existing@example.com", "password123!");
    when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(true);
    
    // When & Then
    assertThrows(ConflictException.class, () -> authService.register(req));
    verify(userRepository, never()).save(any());
  }
  
  @Test
  void register_shouldNormalizeEmailToLowerCase() {
    // Given
    RegisterRequest req = new RegisterRequest("  UPPERCASE@EXAMPLE.COM  ", "password123!");
    when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(jwtService.createAccessToken(any(), anyString(), any())).thenReturn("testToken");
    
    // When
    authService.register(req);
    
    // Then
    verify(userRepository).save(argThat(user -> 
        user.email.equals("uppercase@example.com")));
  }
  
  @Test
  void login_shouldReturnAuthResponse_whenCredentialsAreValid() {
    // Given
    LoginRequest req = new LoginRequest("test@example.com", "password123!");
    Authentication auth = mock(Authentication.class);
    CustomUserDetails userDetails = new CustomUserDetails(testUserId, "test@example.com", "encodedPassword", Role.USER);
    
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
    when(auth.getPrincipal()).thenReturn(userDetails);
    when(jwtService.createAccessToken(any(), anyString(), any())).thenReturn("testToken");
    
    // When
    AuthResponse response = authService.login(req);
    
    // Then
    assertNotNull(response);
    assertEquals("testToken", response.accessToken());
    assertEquals(Role.USER, response.role());
    assertEquals("test@example.com", response.email());
    verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
  }
  
  @Test
  void login_shouldThrowException_whenCredentialsAreInvalid() {
    // Given
    LoginRequest req = new LoginRequest("test@example.com", "wrongPassword");
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenThrow(new BadCredentialsException("Invalid credentials"));
    
    // When & Then
    assertThrows(BadCredentialsException.class, () -> authService.login(req));
    verify(jwtService, never()).createAccessToken(any(), anyString(), any());
  }
  
  @Test
  void register_shouldSetCreatedAtTimestamp() {
    // Given
    RegisterRequest req = new RegisterRequest("timestamp@example.com", "password123!");
    when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(jwtService.createAccessToken(any(), anyString(), any())).thenReturn("testToken");
    
    // When
    authService.register(req);
    
    // Then
    verify(userRepository).save(argThat(user -> user.createdAt != null));
  }
  
  @Test
  void register_shouldAssignUserRole() {
    // Given
    RegisterRequest req = new RegisterRequest("role@example.com", "password123!");
    when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(jwtService.createAccessToken(any(), anyString(), any())).thenReturn("testToken");
    
    // When
    AuthResponse response = authService.register(req);
    
    // Then
    assertEquals(Role.USER, response.role());
  }
  
  @Test
  void register_shouldEncodePassword() {
    // Given
    RegisterRequest req = new RegisterRequest("encode@example.com", "plainPassword");
    when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
    when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
    when(jwtService.createAccessToken(any(), anyString(), any())).thenReturn("testToken");
    
    // When
    authService.register(req);
    
    // Then
    verify(passwordEncoder).encode("plainPassword");
    verify(userRepository).save(argThat(user -> "hashedPassword".equals(user.passwordHash)));
  }
}
