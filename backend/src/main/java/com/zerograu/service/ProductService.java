package com.zerograu.service;

import com.zerograu.dto.PageResponse;
import com.zerograu.dto.ProductDto;
import com.zerograu.entity.Category;
import com.zerograu.entity.Product;
import com.zerograu.exception.AppException;
import com.zerograu.repository.CategoryRepository;
import com.zerograu.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public PageResponse<ProductDto> getProducts(String search, Long categoryId,
                                                 BigDecimal minPrice, BigDecimal maxPrice,
                                                 Boolean featured, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        Specification<Product> spec = buildSpec(search, categoryId, minPrice, maxPrice, featured);
        Page<Product> result = productRepository.findAll(spec, pageable);
        return PageResponse.of(result.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public ProductDto getById(Long id) {
        return toDto(productRepository.findByIdWithCategory(id)
                .orElseThrow(() -> AppException.notFound("Produto não encontrado")));
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getFeatured() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream().map(this::toDto).toList();
    }

    @Transactional
    public ProductDto create(ProductDto dto) {
        Product product = fromDto(dto);
        return toDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto update(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Produto não encontrado"));
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setOriginalPrice(dto.originalPrice());
        product.setStock(dto.stock());
        product.setEmoji(dto.emoji());
        product.setBadge(dto.badge());
        product.setRating(dto.rating());
        product.setActive(dto.active());
        product.setFeatured(dto.featured());
        if (dto.categoryId() != null) {
            Category cat = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> AppException.notFound("Categoria não encontrada"));
            product.setCategory(cat);
        }
        return toDto(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) throw AppException.notFound("Produto não encontrado");
        productRepository.deleteById(id);
    }

    private Specification<Product> buildSpec(String search, Long categoryId,
                                                  BigDecimal minPrice, BigDecimal maxPrice, Boolean featured) {
        return (root, query, cb) -> {
            if (Long.class.equals(query.getResultType()) || long.class.equals(query.getResultType())) {
                // Se for uma query de count, não faz fetch
            } else {
                root.fetch("category", jakarta.persistence.criteria.JoinType.LEFT);
            }
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));
            if (StringUtils.hasText(search)) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            if (featured != null) predicates.add(cb.equal(root.get("featured"), featured));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Pageable buildPageable(int page, int size, String sort) {
        Sort s = switch (sort == null ? "newest" : sort) {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            default -> Sort.by("createdAt").descending();
        };
        return PageRequest.of(page, size, s);
    }

    private Product fromDto(ProductDto dto) {
        Category cat = null;
        if (dto.categoryId() != null) {
            cat = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> AppException.notFound("Categoria não encontrada"));
        }
        return Product.builder()
                .name(dto.name()).description(dto.description()).price(dto.price())
                .originalPrice(dto.originalPrice()).stock(dto.stock()).sku(dto.sku())
                .slug(dto.slug()).imageUrl(dto.imageUrl()).emoji(dto.emoji()).badge(dto.badge())
                .rating(dto.rating() != null ? dto.rating() : 0.0)
                .active(dto.active() != null ? dto.active() : true)
                .featured(dto.featured() != null ? dto.featured() : false)
                .category(cat).build();
    }

    public ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getOriginalPrice(),
                p.getStock(), p.getSku(), p.getSlug(), p.getImageUrl(), p.getEmoji(), p.getBadge(),
                p.getRating(), p.getActive(), p.getFeatured(),
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getCategory() != null ? p.getCategory().getId() : null,
                p.getCreatedAt());
    }
}
