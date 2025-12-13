package com.sweetshop.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(String allowedOrigins) {
  public CorsProperties {
    if (allowedOrigins == null || allowedOrigins.isBlank()) {
      allowedOrigins = "http://localhost:3000,http://127.0.0.1:3000";
    }
  }
}


