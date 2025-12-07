package com.familyhearth.families.dto;

import lombok.Data;

@Data
public class CreateFamilyRequest {
    private String name;
    private String timezone;
    private String adminName;
    private String adminEmail;
    private String phone;
}
