package com.sweetshop.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.auth.dto.LoginRequest;
import com.sweetshop.auth.dto.RegisterRequest;
import com.sweetshop.sweets.dto.AdjustStockRequest;
import com.sweetshop.sweets.dto.CreateSweetRequest;
import com.sweetshop.testcontainers.PostgresTestBase;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SweetsInventoryIT extends PostgresTestBase {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper om;

  private String login(String email, String password) throws Exception {
    String loginJson = om.writeValueAsString(new LoginRequest(email, password));
    String body =
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(loginJson))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return om.readTree(body).get("accessToken").asText();
  }

  private String registerAndGetToken(String email) throws Exception {
    String regJson = om.writeValueAsString(new RegisterRequest(email, "password123!"));
    String body =
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(regJson))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return om.readTree(body).get("accessToken").asText();
  }

  @Test
  void admin_can_create_and_user_can_purchase_until_stock_runs_out() throws Exception {
    String adminToken = login("admin@test.local", "admin123!");
    String userToken = registerAndGetToken("buyer@test.local");

    String createJson =
        om.writeValueAsString(new CreateSweetRequest("Test Sweet", "candies", new BigDecimal("3.50"), 2));

    String created =
        mvc.perform(
                post("/api/sweets")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNotEmpty())
            .andExpect(jsonPath("$.quantity").value(2))
            .andReturn()
            .getResponse()
            .getContentAsString();

    UUID sweetId = UUID.fromString(om.readTree(created).get("id").asText());

    // Purchase 1 -> remaining 1
    mvc.perform(
            post("/api/sweets/" + sweetId + "/purchase")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(new AdjustStockRequest(1))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.quantity").value(1));

    // Purchase 2 -> conflict (not enough stock)
    mvc.perform(
            post("/api/sweets/" + sweetId + "/purchase")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(new AdjustStockRequest(2))))
        .andExpect(status().isConflict());
  }

  @Test
  void restock_requires_admin() throws Exception {
    String adminToken = login("admin@test.local", "admin123!");
    String userToken = registerAndGetToken("user2@test.local");

    String createJson =
        om.writeValueAsString(new CreateSweetRequest("Restock Sweet", "cookies", new BigDecimal("1.00"), 0));
    String created =
        mvc.perform(
                post("/api/sweets")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(createJson))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    UUID sweetId = UUID.fromString(om.readTree(created).get("id").asText());

    mvc.perform(
            post("/api/sweets/" + sweetId + "/restock")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(new AdjustStockRequest(3))))
        .andExpect(status().isForbidden());

    mvc.perform(
            post("/api/sweets/" + sweetId + "/restock")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(new AdjustStockRequest(3))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.quantity").value(3));
  }
}





