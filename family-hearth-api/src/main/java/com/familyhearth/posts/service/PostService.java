package com.familyhearth.posts.service;

import com.familyhearth.media.model.Media;
import com.familyhearth.media.repository.MediaRepository;
import com.familyhearth.posts.MediaNotFoundException;
import com.familyhearth.posts.MediaOwnershipException;
import com.familyhearth.posts.PostMapper;
import com.familyhearth.posts.dto.CreatePostRequest;
import com.familyhearth.posts.dto.PaginatedPostsResponse;
import com.familyhearth.posts.dto.PostDto;
import com.familyhearth.posts.model.Post;
import com.familyhearth.posts.repository.PostRepository;
import com.familyhearth.user.model.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private PostMapper postMapper;

    @Transactional
    public Post createPost(CreatePostRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getUserId();
        Long familyId = userDetails.getFamilyId();

        Post post = new Post();
        post.setAuthorId(userId);
        post.setFamilyId(familyId);
        post.setType(request.getType());
        if (request.getContent() != null) {
            post.setContentJson(request.getContent());
        } else {
            post.setContentJson(Collections.emptyMap());
        }

        if (request.getMediaIds() != null && !request.getMediaIds().isEmpty()) {
            List<Media> mediaItems = mediaRepository.findAllById(request.getMediaIds());

            if (mediaItems.size() != request.getMediaIds().size()) {
                List<Long> foundIds = mediaItems.stream().map(Media::getId).collect(Collectors.toList());
                List<Long> notFoundIds = request.getMediaIds().stream().filter(id -> !foundIds.contains(id)).collect(Collectors.toList());
                throw new MediaNotFoundException("Could not find media with the following IDs: " + notFoundIds);
            }

            for (Media media : mediaItems) {
                if (!media.getFamilyId().equals(familyId)) {
                    throw new MediaOwnershipException("Media " + media.getId() + " does not belong to the same family as the post.");
                }
                media.setPost(post);
            }
            post.setMedia(mediaItems);
        } else {
            post.setMedia(Collections.emptyList());
        }

        return postRepository.save(post);
    }

    public PaginatedPostsResponse getPosts(Long familyId, String cursor, int limit) {
        List<Post> posts;
        PageRequest pageable = PageRequest.of(0, limit);

        // Check if the cursor is null, empty, or the literal string "null"
        if (cursor != null && !cursor.isEmpty() && !cursor.equalsIgnoreCase("null")) {
            String decodedCursor = new String(Base64.getDecoder().decode(cursor));
            String[] parts = decodedCursor.split("_");
            OffsetDateTime cursorTimestamp = OffsetDateTime.parse(parts[0]);
            Long cursorId = Long.parseLong(parts[1]);
            posts = postRepository.findByFamilyIdWithCursor(familyId, cursorTimestamp, cursorId, pageable);
        } else {
            // Treat as the first page request
            posts = postRepository.findByFamilyIdOrderByCreatedAtDescIdDesc(familyId, pageable);
        }

        List<PostDto> postDtos = posts.stream().map(postMapper::toDto).collect(Collectors.toList());

        String nextCursor = null;
        if (posts.size() == limit) {
            Post lastPost = posts.get(posts.size() - 1);
            nextCursor = Base64.getEncoder().encodeToString((lastPost.getCreatedAt() + "_" + lastPost.getId()).getBytes());
        }

        return new PaginatedPostsResponse(postDtos, nextCursor);
    }
}
