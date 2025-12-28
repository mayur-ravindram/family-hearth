package com.familyhearth.comments.service;

import com.familyhearth.comments.CommentMapper;
import com.familyhearth.comments.dto.CommentDto;
import com.familyhearth.comments.dto.CreateCommentRequest;
import com.familyhearth.comments.model.Comment;
import com.familyhearth.comments.repository.CommentRepository;
import com.familyhearth.posts.model.Post;
import com.familyhearth.posts.repository.PostRepository;
import com.familyhearth.user.model.CustomUserDetails;
import com.familyhearth.user.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentMapper commentMapper;

    @PersistenceContext
    private EntityManager entityManager;

    public List<CommentDto> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto createComment(Long postId, CreateCommentRequest request) {
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getUserId();

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setContent(request.getContent());
        
        User author = entityManager.getReference(User.class, userId);
        comment.setAuthor(author);

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getUserId();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own comments.");
        }

        commentRepository.delete(comment);
    }
}
