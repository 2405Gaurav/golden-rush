package com.sweetshop.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.auth.dto.LoginRequest;
import com.sweetshop.auth.dto.RegisterRequest;
import com.sweetshop.testcontainers.PostgresTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndSecurityIT extends PostgresTestBase {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper om;

  @Test
  void register_then_can_access_protected_endpoint() throws Exception {
    String registerJson = om.writeValueAsString(new RegisterRequest("user1@test.local", "password123!"));
    String body =
        mvc.perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(registerJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").isNotEmpty())
            .andReturn()
            .getResponse()
            .getContentAsString();

    String token = om.readTree(body).get("accessToken").asText();

    mvc.perform(get("/api/sweets"))
        .andExpect(status().isUnauthorized());

    mvc.perform(get("/api/sweets").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());
  }

  @Test
  void login_admin_bootstrap_works() throws Exception {
    String loginJson = om.writeValueAsString(new LoginRequest("admin@test.local", "admin123!"));

    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").isNotEmpty())
        .andExpect(jsonPath("$.role").value("ADMIN"));
  }
}





