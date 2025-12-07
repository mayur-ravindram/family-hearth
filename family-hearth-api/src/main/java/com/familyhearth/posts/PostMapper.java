package com.familyhearth.posts;

import com.familyhearth.media.model.Media;
import com.familyhearth.posts.dto.MediaDto;
import com.familyhearth.posts.dto.PostDto;
import com.familyhearth.posts.model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostMapper INSTANCE = Mappers.getMapper(PostMapper.class);

    // This tells MapStruct how to map the Post entity to the PostDto.
    // The "media" field will be handled by the method below.
    PostDto toDto(Post post);

    // This provides the missing piece: how to map a list of Media entities.
    List<MediaDto> toDto(List<Media> media);

    // And this tells MapStruct how to map a single Media entity to a MediaDto.
    // We can add mappings here if field names were different.
    // Since they are the same, no @Mapping annotations are needed.
    MediaDto toDto(Media media);
}
