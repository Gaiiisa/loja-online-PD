package com.zerograu.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductDto(
        Long id,

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String name,

        @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
        String description,

        @NotNull(message = "Preço é obrigatório")
        @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
        BigDecimal price,

        @DecimalMin(value = "0.00", message = "Preço original não pode ser negativo")
        BigDecimal originalPrice,

        @NotNull(message = "Estoque é obrigatório")
        @Min(value = 0, message = "Estoque não pode ser negativo")
        Integer stock,

        @NotBlank(message = "SKU é obrigatório")
        @Size(max = 50, message = "SKU deve ter no máximo 50 caracteres")
        String sku,

        @NotBlank(message = "Slug é obrigatório")
        @Size(max = 100, message = "Slug deve ter no máximo 100 caracteres")
        String slug,

        @Size(max = 255, message = "URL da imagem deve ter no máximo 255 caracteres")
        String imageUrl,

        @Size(max = 10, message = "Emoji deve ter no máximo 10 caracteres")
        String emoji,

        @Size(max = 50, message = "Badge deve ter no máximo 50 caracteres")
        String badge,

        @Min(0) @Max(5)
        Double rating,

        Boolean active,
        Boolean featured,

        String category,

        @NotNull(message = "Categoria é obrigatória")
        Long categoryId,

        LocalDateTime createdAt
) {}
