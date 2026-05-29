package com.zerograu.repository;

import com.zerograu.entity.Order;
import com.zerograu.entity.OrderStatus;
import com.zerograu.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status NOT IN (com.zerograu.entity.OrderStatus.CANCELLED, com.zerograu.entity.OrderStatus.REFUNDED)")
    BigDecimal sumTotalRevenue();
}
