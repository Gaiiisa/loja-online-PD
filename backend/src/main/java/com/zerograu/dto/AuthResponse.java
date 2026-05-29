package com.zerograu.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn,
        UserSummary user
) {
    public record UserSummary(Long id, String name, String email, String role) {}

    public static AuthResponse of(String access, String refresh, long expiresIn, UserSummary user) {
        return new AuthResponse(access, refresh, "Bearer", expiresIn, user);
    }
}
