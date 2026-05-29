package com.zerograu.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record OrderRequest(
        @NotEmpty(message = "O pedido deve ter ao menos um item")
        List<@Valid OrderItemRequest> items,

        @NotBlank(message = "Método de pagamento é obrigatório")
        @Size(max = 50)
        String paymentMethod,

        @Size(max = 20)
        String couponCode,

        @NotNull(message = "Informações de entrega são obrigatórias")
        @Valid ShippingInfo shipping
) {
    public record ShippingInfo(
            @NotBlank(message = "Nome na entrega é obrigatório")
            @Size(max = 100)
            String name,

            @NotBlank(message = "E-mail de contato é obrigatório")
            @Email(message = "E-mail de contato inválido")
            @Size(max = 100)
            String email,

            @NotBlank(message = "Endereço é obrigatório")
            @Size(max = 255)
            String address,

            @NotBlank(message = "Cidade é obrigatória")
            @Size(max = 100)
            String city,

            @NotBlank(message = "Estado é obrigatório")
            @Size(min = 2, max = 2)
            String state,

            @NotBlank(message = "CEP é obrigatório")
            @Size(max = 10)
            String zip
    ) {}
}
