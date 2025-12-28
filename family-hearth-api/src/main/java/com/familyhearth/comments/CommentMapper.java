package com.familyhearth.comments;

import com.familyhearth.comments.dto.CommentDto;
import com.familyhearth.comments.model.Comment;
import com.familyhearth.posts.dto.AuthorDto;
import com.familyhearth.user.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentDto toDto(Comment comment);

    AuthorDto toDto(User user);
}
