package com.familyhearth.posts.dto;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Data
public class PostDto {
    private Long id;
    private AuthorDto author;
    private String type;
    private Map<String, Object> contentJson;
    private List<MediaDto> media;
    private OffsetDateTime createdAt;
    private long likeCount;
    private long commentCount;
    private boolean isLiked;
}
