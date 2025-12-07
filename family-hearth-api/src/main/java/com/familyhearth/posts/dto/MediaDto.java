package com.familyhearth.posts.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class MediaDto {
    private Long id;
    private String contentType;
    private String storagePath;
    private OffsetDateTime createdAt;
}
