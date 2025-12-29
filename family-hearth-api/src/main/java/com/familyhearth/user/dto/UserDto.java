package com.familyhearth.user.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String avatarUrl;
    private Long familyId;
}
