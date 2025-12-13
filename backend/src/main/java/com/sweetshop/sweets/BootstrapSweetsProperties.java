package com.sweetshop.sweets;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.bootstrap-sweets")
public record BootstrapSweetsProperties(boolean enabled, int defaultQuantity) {}
