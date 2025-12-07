package com.familyhearth.media;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.io.Resource;

@Getter
@AllArgsConstructor
public class MediaFile {
    private final Resource resource;
    private final String contentType;
}
