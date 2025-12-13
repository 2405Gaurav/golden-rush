package com.sweetshop.sweets.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record CreateSweetRequest(
    @NotBlank String name,
    @NotBlank String category,
    @NotNull @DecimalMin(value = "0.00", inclusive = true) BigDecimal price,
    @PositiveOrZero int quantity) {}


