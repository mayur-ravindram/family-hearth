package com.familyhearth.posts;

import com.familyhearth.posts.dto.CreatePostRequest;
import com.familyhearth.posts.dto.PaginatedPostsResponse;
import com.familyhearth.posts.dto.PostDto;
import com.familyhearth.posts.model.Post;
import com.familyhearth.posts.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@Tag(name = "Posts", description = "Endpoints for creating and viewing posts within a family.")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private PostMapper postMapper;

    @Operation(summary = "Create a new post", description = "Creates a new post with content and optional media attachments. The post is automatically associated with the authenticated user's family.")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostDto> createPost(@RequestBody CreatePostRequest request) {
        Post post = postService.createPost(request);
        return ResponseEntity.ok(postMapper.toDto(post));
    }
    
    @Operation(summary = "Get posts for a family", description = "Retrieves a paginated list of posts for a specific family using cursor-based pagination.")
    @GetMapping("/families/{familyId}/posts")
    @PreAuthorize("@familyAccessManager.hasAccessToFamily(#familyId)")
    public ResponseEntity<PaginatedPostsResponse> getPosts(
            @PathVariable Long familyId,
            @Parameter(description = "The cursor from the previous page's response to fetch the next set of results.") @RequestParam(required = false) String cursor,
            @Parameter(description = "The maximum number of posts to return per page.") @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(postService.getPosts(familyId, cursor, limit));
    }
}
