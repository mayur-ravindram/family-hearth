package com.familyhearth.families.dto;

import com.familyhearth.families.model.Family;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateFamilyResponse {
    private Family family;
}
