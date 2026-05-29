package com.zerograu.service;

import com.zerograu.dto.OrderItemRequest;
import com.zerograu.dto.OrderRequest;
import com.zerograu.dto.OrderResponse;
import com.zerograu.dto.PageResponse;
import com.zerograu.entity.*;
import com.zerograu.exception.AppException;
import com.zerograu.repository.OrderRepository;
import com.zerograu.repository.ProductRepository;
import com.zerograu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> AppException.notFound("Usuário não encontrado"));

        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : req.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> AppException.notFound("Produto " + itemReq.productId() + " não encontrado"));
            if (!product.getActive()) throw AppException.badRequest("Produto indisponível: " + product.getName());
            if (product.getStock() < itemReq.quantity()) {
                throw AppException.badRequest("Estoque insuficiente para: " + product.getName());
            }
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity()));
            OrderItem item = OrderItem.builder()
                    .product(product).quantity(itemReq.quantity())
                    .unitPrice(product.getPrice()).subtotal(itemSubtotal).build();
            items.add(item);
            subtotal = subtotal.add(itemSubtotal);
            product.setStock(product.getStock() - itemReq.quantity());
            productRepository.save(product);
        }

        BigDecimal shipping = subtotal.compareTo(new BigDecimal("299")) >= 0 ? BigDecimal.ZERO : new BigDecimal("19.90");
        BigDecimal total = subtotal.add(shipping);

        OrderRequest.ShippingInfo si = req.shipping();
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user).status(OrderStatus.PENDING)
                .subtotal(subtotal).shipping(shipping).discount(BigDecimal.ZERO).total(total)
                .paymentMethod(req.paymentMethod()).couponCode(req.couponCode())
                .shippingName(si.name()).shippingEmail(si.email()).shippingAddress(si.address())
                .shippingCity(si.city()).shippingState(si.state()).shippingZip(si.zip())
                .items(new ArrayList<>())
                .build();

        Order saved = orderRepository.save(order);
        items.forEach(i -> { i.setOrder(saved); saved.getItems().add(i); });
        orderRepository.save(saved);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getUserOrders(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> AppException.notFound("Usuário não encontrado"));
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PageResponse.of(orderRepository.findByUserOrderByCreatedAtDesc(user, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Pedido não encontrado"));
        if (!order.getUser().getEmail().equals(email)) throw AppException.forbidden("Acesso negado");
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Pedido não encontrado"));
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw AppException.badRequest("Status inválido: " + status);
        }
        return toResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PageResponse.of(orderRepository.findAll(pageable).map(this::toResponse));
    }

    private String generateOrderNumber() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ZG-" + ts + "-" + rand;
    }

    private OrderResponse toResponse(Order o) {
        List<OrderResponse.ItemDto> items = o.getItems().stream().map(i ->
                new OrderResponse.ItemDto(
                        i.getProduct().getId(), i.getProduct().getName(),
                        i.getProduct().getEmoji(), i.getQuantity(),
                        i.getUnitPrice(), i.getSubtotal()
                )).toList();
        OrderResponse.ShippingInfo si = new OrderResponse.ShippingInfo(
                o.getShippingName(), o.getShippingEmail(), o.getShippingAddress(),
                o.getShippingCity(), o.getShippingState(), o.getShippingZip());
        return new OrderResponse(o.getId(), o.getOrderNumber(), o.getStatus().name(),
                items, o.getSubtotal(), o.getShipping(), o.getDiscount(), o.getTotal(),
                o.getPaymentMethod(), o.getCouponCode(), si, o.getCreatedAt(), o.getUpdatedAt());
    }
}
