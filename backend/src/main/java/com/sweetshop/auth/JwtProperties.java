package com.sweetshop.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security.jwt")
public record JwtProperties(
    String secretBase64,
    String issuer,
    long accessTokenTtlSeconds) {}






