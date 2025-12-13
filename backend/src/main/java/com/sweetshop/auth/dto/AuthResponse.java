package com.sweetshop.auth.dto;

import com.sweetshop.auth.Role;

public record AuthResponse(String accessToken, Role role, String email) {}





