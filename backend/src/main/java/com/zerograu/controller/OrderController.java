package com.zerograu.controller;

import com.zerograu.dto.OrderRequest;
import com.zerograu.dto.OrderResponse;
import com.zerograu.dto.PageResponse;
import com.zerograu.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody OrderRequest req,
                                @AuthenticationPrincipal UserDetails user) {
        return orderService.createOrder(req, user.getUsername());
    }

    @GetMapping
    public PageResponse<OrderResponse> list(@AuthenticationPrincipal UserDetails user,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        return orderService.getUserOrders(user.getUsername(), page, size);
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable Long id,
                                 @AuthenticationPrincipal UserDetails user) {
        return orderService.getOrder(id, user.getUsername());
    }
}
