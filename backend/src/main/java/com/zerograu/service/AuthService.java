package com.zerograu.service;

import com.zerograu.dto.AuthRequest;
import com.zerograu.dto.AuthResponse;
import com.zerograu.dto.RegisterRequest;
import com.zerograu.entity.Role;
import com.zerograu.entity.User;
import com.zerograu.exception.AppException;
import com.zerograu.repository.UserRepository;
import com.zerograu.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw AppException.conflict("E-mail já cadastrado");
        }
        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role(Role.CUSTOMER)
                .build();
        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(AuthRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User user = (User) auth.getPrincipal();
        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.isTokenValid(refreshToken)) {
            throw AppException.unauthorized("Refresh token inválido ou expirado");
        }
        
        Claims claims = jwtTokenProvider.extractClaims(refreshToken);
        String type = claims.get("type", String.class);
        
        if (!"refresh".equals(type)) {
            throw AppException.badRequest("Token fornecido não é um refresh token");
        }

        String email = claims.getSubject();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> AppException.notFound("Usuário não encontrado"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String access = jwtTokenProvider.generateAccessToken(user);
        String refresh = jwtTokenProvider.generateRefreshToken(user);
        AuthResponse.UserSummary summary = new AuthResponse.UserSummary(
                user.getId(), user.getName(), user.getEmail(), user.getRole().name());
        return AuthResponse.of(access, refresh, jwtTokenProvider.getExpirationMs(), summary);
    }
}
