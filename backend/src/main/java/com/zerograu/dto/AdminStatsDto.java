package com.zerograu.dto;

import java.math.BigDecimal;

public record AdminStatsDto(
        long totalUsers,
        long totalProducts,
        long totalOrders,
        BigDecimal totalRevenue,
        long pendingOrders,
        long outOfStockProducts
) {}
