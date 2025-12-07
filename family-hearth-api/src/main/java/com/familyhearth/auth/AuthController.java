package com.familyhearth.auth;

import com.familyhearth.auth.dto.*;
import com.familyhearth.auth.model.RefreshToken;
import com.familyhearth.auth.service.AuthService;
import com.familyhearth.auth.service.RefreshTokenService;
import com.familyhearth.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/magic-link")
    public ResponseEntity<Void> sendMagicLink(@RequestBody MagicLinkRequest request) {
        authService.sendMagicLink(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyTokenResponse> verifyToken(@RequestBody VerifyTokenRequest request) {
        User user = authService.verifyAndConsumeToken(request.getToken());
        String accessToken = authService.generateJwtForUser(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return ResponseEntity.ok(new VerifyTokenResponse(accessToken, refreshToken.getToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());
        User user = refreshToken.getUser();
        String newAccessToken = authService.generateJwtForUser(user);
        // For enhanced security, you could also rotate the refresh token here
        // RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
        return ResponseEntity.ok(new RefreshTokenResponse(newAccessToken, request.getRefreshToken()));
    }
}
