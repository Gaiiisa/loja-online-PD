package com.zerograu.config;

import com.zerograu.entity.Category;
import com.zerograu.entity.Product;
import com.zerograu.entity.Role;
import com.zerograu.entity.User;
import com.zerograu.repository.CategoryRepository;
import com.zerograu.repository.ProductRepository;
import com.zerograu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        List<Category> categories = seedCategories();
        seedProducts(categories);
        log.info("DataInitializer: seed complete.");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;
        userRepository.saveAll(List.of(
                User.builder().name("Admin ZeroGrau").email("admin@zerograu.com")
                        .password(passwordEncoder.encode("admin123")).role(Role.ADMIN).build(),
                User.builder().name("Ana Souza").email("ana@zerograu.com")
                        .password(passwordEncoder.encode("cliente123")).role(Role.CUSTOMER).build(),
                User.builder().name("Bruno Lima").email("bruno@zerograu.com")
                        .password(passwordEncoder.encode("cliente123")).role(Role.CUSTOMER).build()
        ));
        log.info("Seeded 3 users");
    }

    private List<Category> seedCategories() {
        if (categoryRepository.count() > 0) return categoryRepository.findAll();
        return categoryRepository.saveAll(List.of(
                Category.builder().name("Hoodies").slug("hoodies").build(),
                Category.builder().name("Camisetas").slug("tshirts").build(),
                Category.builder().name("Bonés").slug("caps").build(),
                Category.builder().name("Tênis").slug("sneakers").build(),
                Category.builder().name("Calças").slug("pants").build(),
                Category.builder().name("Acessórios").slug("accessories").build()
        ));
    }

    private void seedProducts(List<Category> categories) {
        if (productRepository.count() > 0) return;
        Category hoodies = find(categories, "Hoodies");
        Category tshirts = find(categories, "Camisetas");
        Category caps = find(categories, "Bonés");
        Category sneakers = find(categories, "Tênis");
        Category pants = find(categories, "Calças");
        Category accessories = find(categories, "Acessórios");

        productRepository.saveAll(List.of(
                build("ICE Hoodie Classic", "Hoodie premium com fleece interno glacial, estampa embossed e capuz duplo. Edição limitada.",
                        new BigDecimal("389.00"), null, 42, "ZG-0001", "ice-hoodie-classic", "🧥", "new", 4.9, true, hoodies),
                build("Frost Tee Oversize", "Camiseta oversize 100% algodão 380g. Drop shoulder, gola reforçada.",
                        new BigDecimal("159.00"), null, 18, "ZG-0002", "frost-tee-oversize", "👕", "hit", 4.7, true, tshirts),
                build("Zero Cap Snapback", "Snapback 6 painéis com logo 3D bordado e aba reta.",
                        new BigDecimal("149.00"), null, 7, "ZG-0003", "zero-cap-snapback", "🧢", "new", 4.6, false, caps),
                build("Cryo Sneaker HI", "Tênis high-top com solado vulcanizado, couro sintético e ilhós metálicos.",
                        new BigDecimal("599.00"), new BigDecimal("749.00"), 3, "ZG-0004", "cryo-sneaker-hi", "👟", "sale", 4.8, true, sneakers),
                build("Arctic Jogger", "Calça jogger com elástico duplo, bolsos zíper e bordado lateral.",
                        new BigDecimal("279.00"), null, 25, "ZG-0005", "arctic-jogger", "👖", null, 4.5, false, pants),
                build("Blizzard Crewneck", "Moletom careca com interior felpudo, estampa frontal e ribana reforçada.",
                        new BigDecimal("329.00"), null, 11, "ZG-0006", "blizzard-crewneck", "🥷", "hit", 4.8, true, hoodies),
                build("Sub-Zero Tee", "Tee básica com corte slim, gola redonda reforçada. 5 cores disponíveis.",
                        new BigDecimal("139.00"), null, 33, "ZG-0007", "sub-zero-tee", "🎽", null, 4.4, false, tshirts),
                build("Glacier Beanie", "Touca com logo bordado, ribana dupla e fio de algodão premium.",
                        new BigDecimal("89.00"), null, 19, "ZG-0008", "glacier-beanie", "🎿", "new", 4.3, false, accessories)
        ));
        log.info("Seeded 8 products");
    }

    private Category find(List<Category> cats, String name) {
        return cats.stream().filter(c -> c.getName().equals(name)).findFirst().orElseThrow();
    }

    private Product build(String name, String desc, BigDecimal price, BigDecimal origPrice,
                          int stock, String sku, String slug, String emoji, String badge,
                          double rating, boolean featured, Category category) {
        return Product.builder()
                .name(name).description(desc).price(price).originalPrice(origPrice)
                .stock(stock).sku(sku).slug(slug).emoji(emoji).badge(badge)
                .rating(rating).featured(featured).active(true).category(category).build();
    }
}
