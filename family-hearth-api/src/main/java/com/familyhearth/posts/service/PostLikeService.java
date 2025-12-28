package com.familyhearth.posts.service;

import com.familyhearth.posts.model.PostLike;
import com.familyhearth.posts.model.PostLikeId;
import com.familyhearth.posts.repository.PostLikeRepository;
import com.familyhearth.user.model.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Transactional
    public void likePost(Long postId) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getUserId();

        PostLikeId id = new PostLikeId(postId, userId);
        if (!postLikeRepository.existsById(id)) {
            PostLike postLike = new PostLike();
            postLike.setId(id);
            postLikeRepository.save(postLike);
        }
    }

    @Transactional
    public void unlikePost(Long postId) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getUserId();

        PostLikeId id = new PostLikeId(postId, userId);
        if (postLikeRepository.existsById(id)) {
            postLikeRepository.deleteById(id);
        }
    }
}
