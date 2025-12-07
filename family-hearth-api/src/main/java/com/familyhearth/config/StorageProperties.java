package com.familyhearth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("storage")
public class StorageProperties {

    /**
     * The location for storing uploaded files. Defaults to 'fh-uploads' in the user's home directory.
     * This can be an absolute path.
     * e.g., C:/myapp/uploads or /var/data/myapp/uploads
     */
    private String location = System.getProperty("user.home") + "/fh-uploads";

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
