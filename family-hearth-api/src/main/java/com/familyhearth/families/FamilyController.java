package com.familyhearth.families;

import com.familyhearth.families.dto.CreateFamilyRequest;
import com.familyhearth.families.dto.CreateFamilyResponse;
import com.familyhearth.families.model.Family;
import com.familyhearth.families.service.FamilyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/families")
public class FamilyController {

    private final FamilyService familyService;

    @Autowired
    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @PostMapping
    public ResponseEntity<CreateFamilyResponse> createFamily(@RequestBody CreateFamilyRequest request) {
        Family family = familyService.createFamily(request);
        CreateFamilyResponse response = new CreateFamilyResponse(family);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{familyId}")
    @PreAuthorize("@familyAccessManager.hasAccessToFamily(#familyId)")
    public ResponseEntity<Family> getFamily(@PathVariable Long familyId) {
        Family family = familyService.getFamily(familyId);
        return ResponseEntity.ok(family);
    }
}
