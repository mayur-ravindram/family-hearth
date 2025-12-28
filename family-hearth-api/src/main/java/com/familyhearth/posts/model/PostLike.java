package com.familyhearth.posts.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "post_likes")
@Data
@NoArgsConstructor
public class PostLike {

    @EmbeddedId
    private PostLikeId id;

    @CreationTimestamp
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public PostLike(Long postId, Long userId) {
        this.id = new PostLikeId(postId, userId);
    }
}