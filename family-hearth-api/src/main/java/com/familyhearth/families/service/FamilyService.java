package com.familyhearth.families.service;

import com.familyhearth.config.CacheConfig;
import com.familyhearth.families.dto.CreateFamilyRequest;
import com.familyhearth.families.model.Family;
import com.familyhearth.families.repository.FamilyRepository;
import com.familyhearth.invites.UserAlreadyExistsException;
import com.familyhearth.user.model.Role;
import com.familyhearth.user.model.User;
import com.familyhearth.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserService userService;

    @Autowired
    public FamilyService(FamilyRepository familyRepository, @Lazy UserService userService) {
        this.familyRepository = familyRepository;
        this.userService = userService;
    }

    @Transactional
    public Family createFamily(CreateFamilyRequest request) {
        if (userService.userExists(request.getAdminEmail())) {
            throw new UserAlreadyExistsException("A user with email " + request.getAdminEmail() + " already exists.");
        }

        Family family = new Family();
        family.setName(request.getName());
        family.setTimezone(request.getTimezone());
        Family savedFamily = familyRepository.save(family);

        User admin = new User();
        // Split the adminName into first and last names
        String[] nameParts = request.getAdminName().split(" ", 2);
        admin.setFirstName(nameParts[0]);
        admin.setLastName(nameParts.length > 1 ? nameParts[1] : null);
        
        admin.setEmail(request.getAdminEmail());
        admin.setPhone(request.getPhone());
        admin.setRole(Role.ROLE_ADMIN);
        admin.setFamilyId(savedFamily.getId());
        User savedAdmin = userService.save(admin);

        savedFamily.setAdminId(savedAdmin.getId());
        return familyRepository.save(savedFamily);
    }

    @Cacheable(value = CacheConfig.FAMILIES_CACHE, key = "#familyId")
    public Family getFamily(Long familyId) {
        return familyRepository.findById(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found"));
    }
}
