package com.familyhearth.media;

import com.familyhearth.media.dto.ConfirmMediaRequest;
import com.familyhearth.media.dto.SignedUrlRequest;
import com.familyhearth.media.dto.SignedUrlResponse;
import com.familyhearth.media.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping("/signed-url")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SignedUrlResponse> createSignedUrl(@RequestBody SignedUrlRequest request) {
        return ResponseEntity.ok(mediaService.createSignedUrl(request));
    }

    @PutMapping("/upload/{mediaId}")
    public ResponseEntity<Void> uploadFile(@PathVariable Long mediaId, InputStream inputStream) throws IOException {
        mediaService.saveTempFile(mediaId, inputStream);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirm")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> confirmMedia(@RequestBody ConfirmMediaRequest request) throws IOException {
        mediaService.confirmMedia(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        MediaFile mediaFile = mediaService.loadFileAsResource(filename);

        // Use the content type from the database, with a safe fallback.
        String contentType = mediaFile.getContentType() != null ? mediaFile.getContentType() : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + mediaFile.getResource().getFilename() + "\"")
                .body(mediaFile.getResource());
    }
}
