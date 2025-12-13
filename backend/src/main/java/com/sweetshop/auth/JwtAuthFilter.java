package com.sweetshop.auth;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwt;
  private final CustomUserDetailsService userDetailsService;

  public JwtAuthFilter(JwtService jwt, CustomUserDetailsService userDetailsService) {
    this.jwt = jwt;
    this.userDetailsService = userDetailsService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String auth = request.getHeader("Authorization");
    if (auth == null || !auth.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = auth.substring("Bearer ".length()).trim();
    try {
      Claims claims = jwt.parse(token);
      String email = claims.get("email", String.class);
      if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails ud = userDetailsService.loadUserByUsername(email);
        UsernamePasswordAuthenticationToken at =
            new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
        at.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(at);
      }
    } catch (Exception _ignored) {
      // invalid/expired token -> proceed unauthenticated
    }

    filterChain.doFilter(request, response);
  }
}






