package com.familyhearth;

import com.familyhearth.config.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class FamilyHearthApplication {

    public static void main(String[] args) {
        SpringApplication.run(FamilyHearthApplication.class, args);
    }
}
