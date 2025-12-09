package com.familyhearth.user;

import com.familyhearth.user.dto.UserDto;
import com.familyhearth.user.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}
