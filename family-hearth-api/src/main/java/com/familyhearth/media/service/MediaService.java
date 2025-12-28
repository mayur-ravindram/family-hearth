package com.familyhearth.media.service;

import com.familyhearth.config.StorageProperties;
import com.familyhearth.media.MediaFile;
import com.familyhearth.media.MediaNotFoundException;
import com.familyhearth.media.dto.ConfirmMediaRequest;
import com.familyhearth.media.dto.SignedUrlRequest;
import com.familyhearth.media.dto.SignedUrlResponse;
import com.familyhearth.media.model.Media;
import com.familyhearth.media.model.MediaStatus;
import com.familyhearth.media.repository.MediaRepository;
import com.familyhearth.user.model.CustomUserDetails;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    private final Path rootLocation;
    private Path tempDir;
    private Path permanentDir;

    // Simple map to get a file extension from a content type
    private static final Map<String, String> CONTENT_TYPE_TO_EXTENSION = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/gif", ".gif",
            "video/mp4", ".mp4"
    );

    @Autowired
    public MediaService(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
    }

    @PostConstruct
    public void init() {
        try {
            this.tempDir = rootLocation.resolve("temp-uploads");
            this.permanentDir = rootLocation.resolve("uploads");
            Files.createDirectories(tempDir);
            Files.createDirectories(permanentDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Transactional
    public SignedUrlResponse createSignedUrl(SignedUrlRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getUserId();
        Long familyId = userDetails.getFamilyId();

        Media media = new Media();
        media.setUploadedBy(userId);
        media.setFamilyId(familyId);
        media.setContentType(request.getContentType());
        media.setStatus(MediaStatus.PENDING);
        
        // Save first to generate the ID
        Media savedMedia = mediaRepository.save(media);

        // Now, construct the full filename and update the storagePath
        String extension = CONTENT_TYPE_TO_EXTENSION.getOrDefault(request.getContentType(), "");
        String filename = savedMedia.getId() + extension;
        savedMedia.setStoragePath(filename);
        
        // Save again to update the storagePath
        mediaRepository.save(savedMedia);

        String uploadUrl = "/media/upload/" + savedMedia.getId();
        return new SignedUrlResponse(savedMedia.getId(), uploadUrl);
    }

    @Transactional
    public void saveTempFile(Long mediaId, InputStream inputStream) throws IOException {
        if (mediaId == null) {
            throw new IllegalArgumentException("Media ID cannot be null");
        }
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new MediaNotFoundException("Media record not found for ID: " + mediaId));

        if (media.getStatus() != MediaStatus.PENDING) {
            throw new IllegalStateException("Media is not in PENDING state.");
        }

        // Use the full filename from storagePath for the temporary file
        Path tempFile = this.tempDir.resolve(media.getStoragePath());
        Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING);

        media.setStatus(MediaStatus.UPLOADED);
        mediaRepository.save(media);
    }

    @Transactional
    public void confirmMedia(ConfirmMediaRequest request) throws IOException {
        if (request.getMediaId() == null) {
            throw new IllegalArgumentException("Media ID cannot be null");
        }
        Media media = mediaRepository.findById(request.getMediaId())
                .orElseThrow(() -> new MediaNotFoundException("Media record not found for ID: " + request.getMediaId()));

        if (media.getStatus() != MediaStatus.UPLOADED) {
            throw new IllegalStateException("Media is not in UPLOADED state.");
        }

        // Use the full filename from storagePath for both temp and permanent files
        Path tempFile = this.tempDir.resolve(media.getStoragePath());
        Path permanentFile = this.permanentDir.resolve(media.getStoragePath());
        Files.move(tempFile, permanentFile, StandardCopyOption.REPLACE_EXISTING);

        media.setStatus(MediaStatus.CONFIRMED);
        mediaRepository.save(media);
    }

    public MediaFile loadFileAsResource(String filename) {
        try {
            // Find the media record by its full filename
            Media media = mediaRepository.findByStoragePath(filename)
                    .orElseThrow(() -> new MediaNotFoundException("Media record not found for filename: " + filename));

            Path file = permanentDir.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.isReadable()) {
                return new MediaFile(resource, media.getContentType());
            } else {
                throw new MediaNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new MediaNotFoundException("Could not read file: " + filename);
        }
    }
}
