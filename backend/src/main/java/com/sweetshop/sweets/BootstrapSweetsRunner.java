package com.sweetshop.sweets;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BootstrapSweetsRunner implements CommandLineRunner {
  private final BootstrapSweetsProperties props;
  private final SweetRepository sweets;

  public BootstrapSweetsRunner(BootstrapSweetsProperties props, SweetRepository sweets) {
    this.props = props;
    this.sweets = sweets;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (!props.enabled()) return;

    // Define default sweets
    List<DefaultSweet> defaultSweets = List.of(
        // Chocolates
        new DefaultSweet("Chocolate Truffles", "chocolates", new BigDecimal("12.99")),
        new DefaultSweet("Mint Chocolate Bar", "chocolates", new BigDecimal("8.50")),
        new DefaultSweet("Caramel Fudge", "chocolates", new BigDecimal("15.99")),
        
        // Candies
        new DefaultSweet("Colorful Gummy Bears", "candies", new BigDecimal("6.99")),
        new DefaultSweet("Rainbow Lollipops", "candies", new BigDecimal("4.50")),
        
        // Cakes
        new DefaultSweet("Strawberry Cupcakes", "cakes", new BigDecimal("18.99")),
        new DefaultSweet("Vanilla Macarons", "cakes", new BigDecimal("22.50")),
        
        // Cookies
        new DefaultSweet("Chocolate Chip Cookies", "cookies", new BigDecimal("9.99"))
    );

    // Add each default sweet if it doesn't exist
    for (DefaultSweet defaultSweet : defaultSweets) {
      if (sweets.findByNameIgnoreCase(defaultSweet.name).isEmpty()) {
        sweets.save(createSweet(defaultSweet.name, defaultSweet.category, defaultSweet.price));
      }
    }
  }

  private record DefaultSweet(String name, String category, java.math.BigDecimal price) {}

  private SweetEntity createSweet(String name, String category, BigDecimal price) {
    SweetEntity sweet = new SweetEntity();
    sweet.id = UUID.randomUUID();
    sweet.name = name;
    sweet.category = category.toLowerCase();
    sweet.price = price;
    sweet.quantity = props.defaultQuantity();
    sweet.createdAt = Instant.now();
    sweet.updatedAt = Instant.now();
    return sweet;
  }
}

