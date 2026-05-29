package com.zerograu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemRequest(
        @NotNull(message = "ID do produto é obrigatório")
        Long productId,

        @NotNull(message = "Quantidade é obrigatória")
        @Positive(message = "Quantidade deve ser positiva")
        @Min(value = 1, message = "Quantidade mínima é 1")
        Integer quantity
) {}
