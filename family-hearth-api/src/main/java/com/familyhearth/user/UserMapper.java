package com.familyhearth.user;

import com.familyhearth.user.dto.UserDto;
import com.familyhearth.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    /**
     * This method declaration tells MapStruct to generate the implementation
     * to convert a User entity to a UserDto.
     * Since the field names (id, firstName, lastName, email) are identical
     * between the two classes, no further @Mapping annotations are needed.
     */
    UserDto toDto(User user);
}
