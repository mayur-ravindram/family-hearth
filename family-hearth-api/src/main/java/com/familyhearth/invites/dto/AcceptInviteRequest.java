package com.familyhearth.invites.dto;

import lombok.Data;

@Data
public class AcceptInviteRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
}
