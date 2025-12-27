package com.familyhearth.user;

import com.familyhearth.families.model.Family;
import com.familyhearth.user.dto.UpdateUserRequest;
import com.familyhearth.user.dto.UserDto;
import com.familyhearth.user.model.User;
import com.familyhearth.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getMe() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(userMapper.toDto(currentUser));
    }

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateUser(@RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUser(request);
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @GetMapping("/me/family")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Family> getMyFamily() {
        Family family = userService.getFamilyForCurrentUser();
        return ResponseEntity.ok(family);
    }
}
