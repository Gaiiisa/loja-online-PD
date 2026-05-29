package com.zerograu.controller;

import com.zerograu.dto.AdminStatsDto;
import com.zerograu.dto.OrderResponse;
import com.zerograu.dto.PageResponse;
import com.zerograu.dto.UserSummaryDto;
import com.zerograu.entity.OrderStatus;
import com.zerograu.repository.OrderRepository;
import com.zerograu.repository.ProductRepository;
import com.zerograu.repository.UserRepository;
import com.zerograu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public AdminStatsDto stats() {
        return new AdminStatsDto(
                userRepository.count(),
                productRepository.count(),
                orderRepository.count(),
                orderRepository.sumTotalRevenue(),
                orderRepository.countByStatus(OrderStatus.PENDING),
                productRepository.countOutOfStock()
        );
    }

    @GetMapping("/orders")
    public PageResponse<OrderResponse> orders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return orderService.getAllOrders(page, size);
    }

    @PatchMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        return orderService.updateStatus(id, body.get("status"));
    }

    @GetMapping("/users")
    public PageResponse<UserSummaryDto> users(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "50") int size) {
        var pageable = PageRequest.of(page, size);
        return PageResponse.of(userRepository.findAll(pageable).map(u ->
                new UserSummaryDto(u.getId(), u.getName(), u.getEmail(),
                        u.getRole().name(), u.isEnabled(), u.getCreatedAt())));
    }
}
