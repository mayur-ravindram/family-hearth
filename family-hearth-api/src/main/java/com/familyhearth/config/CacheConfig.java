package com.familyhearth.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    public static final String FAMILIES_CACHE = "families";
    public static final String USERS_CACHE = "users";
}
