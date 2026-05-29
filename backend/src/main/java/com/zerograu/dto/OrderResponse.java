package com.zerograu.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String status,
        List<ItemDto> items,
        BigDecimal subtotal,
        BigDecimal shipping,
        BigDecimal discount,
        BigDecimal total,
        String paymentMethod,
        String couponCode,
        ShippingInfo shippingInfo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record ItemDto(
            Long productId,
            String productName,
            String emoji,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal subtotal
    ) {}

    public record ShippingInfo(
            String name, String email,
            String address, String city,
            String state, String zip
    ) {}
}
