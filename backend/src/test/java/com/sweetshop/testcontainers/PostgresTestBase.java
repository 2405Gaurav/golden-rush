package com.sweetshop.testcontainers;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
public abstract class PostgresTestBase {
  static final PostgreSQLContainer<?> postgres =
      new PostgreSQLContainer<>("postgres:16-alpine")
          .withDatabaseName("sweetshop_test")
          .withUsername("test")
          .withPassword("test");

  @BeforeAll
  static void start() {
    postgres.start();
  }

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
    registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    registry.add("app.security.jwt.secret-base64", () -> "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=");
    registry.add("app.security.jwt.issuer", () -> "sweetshop-test");
    registry.add("app.security.jwt.access-token-ttl-seconds", () -> "3600");
    registry.add("app.bootstrap-admin.enabled", () -> "true");
    registry.add("app.bootstrap-admin.email", () -> "admin@test.local");
    registry.add("app.bootstrap-admin.password", () -> "admin123!");
    registry.add("app.cors.allowed-origins", () -> "http://localhost:3000");
  }
}






