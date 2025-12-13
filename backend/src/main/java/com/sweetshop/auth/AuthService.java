package com.sweetshop.auth;

import com.sweetshop.auth.dto.AuthResponse;
import com.sweetshop.auth.dto.LoginRequest;
import com.sweetshop.auth.dto.RegisterRequest;
import com.sweetshop.common.ConflictException;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthService(
      UserRepository users,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService) {
    this.users = users;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    if (users.existsByEmailIgnoreCase(req.email())) {
      throw new ConflictException("Email already registered");
    }
    
    UserEntity u = new UserEntity();
    u.id = UUID.randomUUID();
    u.email = req.email().trim().toLowerCase();
    u.passwordHash = passwordEncoder.encode(req.password());
    u.role = Role.USER;
    u.createdAt = Instant.now();
    
    users.save(u);
    String token = jwtService.createAccessToken(u.id, u.email, u.role);
    return new AuthResponse(token, u.role, u.email);
  }

  public AuthResponse login(LoginRequest req) {
    Authentication auth =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    CustomUserDetails ud = (CustomUserDetails) auth.getPrincipal();
    String token = jwtService.createAccessToken(ud.id(), ud.getUsername(), ud.role());
    return new AuthResponse(token, ud.role(), ud.getUsername());
  }
}






