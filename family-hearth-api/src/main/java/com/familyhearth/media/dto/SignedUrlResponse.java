package com.familyhearth.media.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignedUrlResponse {
    private Long mediaId;
    private String uploadUrl;
}
