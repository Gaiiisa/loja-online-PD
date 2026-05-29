package com.zerograu.dto;

import java.time.LocalDateTime;

public record UserSummaryDto(
        Long id,
        String name,
        String email,
        String role,
        boolean enabled,
        LocalDateTime createdAt
) {}
