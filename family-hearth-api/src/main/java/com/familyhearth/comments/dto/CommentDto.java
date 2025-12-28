package com.familyhearth.comments.dto;

import com.familyhearth.posts.dto.AuthorDto;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CommentDto {
    private Long id;
    private Long postId;
    private AuthorDto author;
    private String content;
    private OffsetDateTime createdAt;
}
