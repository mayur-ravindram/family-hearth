package com.familyhearth.auth.service;

import com.familyhearth.auth.InvalidTokenException;
import com.familyhearth.auth.JwtService;
import com.familyhearth.auth.model.MagicLinkToken;
import com.familyhearth.auth.model.RefreshToken;
import com.familyhearth.auth.repository.MagicLinkTokenRepository;
import com.familyhearth.user.model.Role;
import com.familyhearth.user.model.User;
import com.familyhearth.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private MagicLinkTokenRepository magicLinkTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Transactional
    public void sendMagicLink(String email) {
        MagicLinkToken magicLinkToken = new MagicLinkToken();
        magicLinkToken.setToken(UUID.randomUUID().toString());
        magicLinkToken.setEmail(email);
        magicLinkToken.setExpiresAt(OffsetDateTime.now().plusMinutes(15));
        magicLinkTokenRepository.save(magicLinkToken);
        System.out.println("Magic link for " + email + ": " + magicLinkToken.getToken());
    }

    @Transactional
    public User verifyAndConsumeToken(String token) {
        MagicLinkToken magicLinkToken = magicLinkTokenRepository.findByTokenAndExpiresAtAfter(token, OffsetDateTime.now())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired magic link token."));

        magicLinkTokenRepository.delete(magicLinkToken);

        return userRepository.findByEmail(magicLinkToken.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(magicLinkToken.getEmail());
                    newUser.setRole(Role.ROLE_USER);
                    return userRepository.save(newUser);
                });
    }

    public String generateJwtForUser(User user) {
        return jwtService.generateToken(user);
    }
}
