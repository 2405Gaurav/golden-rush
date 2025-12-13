package com.sweetshop.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final JwtProperties props;
  private final SecretKey key;

  public JwtService(JwtProperties props) {
    this.props = props;
    if (props.secretBase64() == null || props.secretBase64().isBlank()) {
      throw new IllegalStateException("JWT_SECRET_BASE64 is required");
    }
    this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(props.secretBase64()));
  }

  public String createAccessToken(UUID userId, String email, Role role) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(props.accessTokenTtlSeconds());
    return Jwts.builder()
        .issuer(props.issuer())
        .subject(userId.toString())
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .claims(Map.of("email", email, "role", role.name()))
        .signWith(key, Jwts.SIG.HS256)
        .compact();
  }

  public Claims parse(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .requireIssuer(props.issuer())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}


