package com.familyhearth.posts;

import com.familyhearth.media.model.Media;
import com.familyhearth.posts.dto.AuthorDto;
import com.familyhearth.posts.dto.MediaDto;
import com.familyhearth.posts.dto.PostDto;
import com.familyhearth.posts.model.Post;
import com.familyhearth.user.model.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostDto toDto(Post post);

    List<MediaDto> toDto(List<Media> media);

    MediaDto toDto(Media media);

    AuthorDto toDto(User user);

    @AfterMapping
    default void handleNullContentJson(Post post, @MappingTarget PostDto postDto) {
        if (postDto.getContentJson() == null) {
            postDto.setContentJson(Collections.emptyMap());
        }
    }
}
