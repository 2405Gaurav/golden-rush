package com.sweetshop.auth;

import java.time.Instant;
import java.util.UUID;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BootstrapAdminRunner implements CommandLineRunner {
  private final BootstrapAdminProperties props;
  private final UserRepository users;
  private final PasswordEncoder passwordEncoder;

  public BootstrapAdminRunner(
      BootstrapAdminProperties props, UserRepository users, PasswordEncoder passwordEncoder) {
    this.props = props;
    this.users = users;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (!props.enabled()) return;
    String email = props.email().trim().toLowerCase();
    if (users.existsByEmailIgnoreCase(email)) return;

    UserEntity admin = new UserEntity();
    admin.id = UUID.randomUUID();
    admin.email = email;
    admin.passwordHash = passwordEncoder.encode(props.password());
    admin.role = Role.ADMIN;
    admin.createdAt = Instant.now();
    users.save(admin);
  }
}





