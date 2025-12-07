package com.familyhearth.posts.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class CreatePostRequest {
    private String type;
    private Map<String, Object> content;
    private List<Long> mediaIds;
}
