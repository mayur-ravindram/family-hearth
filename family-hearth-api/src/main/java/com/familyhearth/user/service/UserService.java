package com.familyhearth.user.service;

import com.familyhearth.config.CacheConfig;
import com.familyhearth.exception.FamilyNotFoundException;
import com.familyhearth.families.model.Family;
import com.familyhearth.families.service.FamilyService;
import com.familyhearth.media.MediaNotFoundException;
import com.familyhearth.media.model.Media;
import com.familyhearth.media.model.MediaStatus;
import com.familyhearth.media.repository.MediaRepository;
import com.familyhearth.posts.MediaOwnershipException;
import com.familyhearth.user.dto.UpdateUserRequest;
import com.familyhearth.user.model.CustomUserDetails;
import com.familyhearth.user.model.User;
import com.familyhearth.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final FamilyService familyService;
    private final MediaRepository mediaRepository;

    @Autowired
    public UserService(UserRepository userRepository, FamilyService familyService, MediaRepository mediaRepository) {
        this.userRepository = userRepository;
        this.familyService = familyService;
        this.mediaRepository = mediaRepository;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    @Cacheable(value = CacheConfig.USERS_CACHE, key = "#email")
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = findUserByEmail(email);
        return new CustomUserDetails(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            // We can use the email from the UserDetails to fetch the full User object
            return findUserByEmail(userDetails.getUsername());
        }
        throw new IllegalStateException("The authenticated principal is not an instance of CustomUserDetails.");
    }

    public Family getFamilyForCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            Long familyId = userDetails.getFamilyId();

            if (familyId == null) {
                throw new FamilyNotFoundException("Family information not found for the authenticated user.");
            }
            return familyService.getFamily(familyId);
        }

        throw new IllegalStateException("The authenticated principal is not an instance of CustomUserDetails.");
    }

    @Transactional
    public User updateUser(UpdateUserRequest request) {
        User user = getCurrentUser();

        if (request.getAvatarFileId() != null) {
            Media media = mediaRepository.findById(request.getAvatarFileId())
                    .orElseThrow(() -> new MediaNotFoundException("Media not found with ID: " + request.getAvatarFileId()));
            
            if (!media.getUploadedBy().equals(user.getId())) {
                throw new MediaOwnershipException("You do not own this media file.");
            }

            // Allow UPLOADED or CONFIRMED status. If it's just UPLOADED, we can implicitly confirm it here or require explicit confirmation.
            // For simplicity, let's assume the frontend calls /media/confirm first, or we allow UPLOADED state.
            if (media.getStatus() == MediaStatus.PENDING) {
                throw new IllegalStateException("Media file has not been uploaded yet.");
            }

            // Construct the public URL
            String avatarUrl = "/media/files/" + media.getStoragePath();
            user.setAvatarUrl(avatarUrl);
        }

        return userRepository.save(user);
    }
}
