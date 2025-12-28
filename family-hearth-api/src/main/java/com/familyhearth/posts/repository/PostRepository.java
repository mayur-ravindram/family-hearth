package com.familyhearth.posts.repository;

import com.familyhearth.posts.model.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // For the first page, when no cursor is provided
    @EntityGraph(attributePaths = {"author", "media"})
    List<Post> findByFamilyIdOrderByCreatedAtDescIdDesc(Long familyId, Pageable pageable);

    // For subsequent pages, when a cursor is provided
    @EntityGraph(attributePaths = {"author", "media"})
    @Query("SELECT p FROM Post p WHERE p.familyId = :familyId AND " +
            "(p.createdAt < :cursorTimestamp OR " +
            "(p.createdAt = :cursorTimestamp AND p.id < :cursorId)) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Post> findByFamilyIdWithCursor(
            @Param("familyId") Long familyId,
            @Param("cursorTimestamp") OffsetDateTime cursorTimestamp,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );
}
