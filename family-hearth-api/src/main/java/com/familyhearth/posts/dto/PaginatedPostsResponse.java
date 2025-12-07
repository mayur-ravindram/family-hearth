package com.familyhearth.posts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PaginatedPostsResponse {
    private List<PostDto> posts;
    private String nextCursor;
}
