package com.familyhearth.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerifyTokenResponse {
    private String accessToken;
    private String refreshToken;
}
