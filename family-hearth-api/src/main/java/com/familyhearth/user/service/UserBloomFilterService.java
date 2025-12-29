package com.familyhearth.user.service;

import com.familyhearth.user.repository.UserRepository;
import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class UserBloomFilterService {

    @Autowired
    private UserRepository userRepository;

    private BloomFilter<String> userEmailBloomFilter;

    @PostConstruct
    public void init() {
        List<String> allUserEmails = userRepository.findAllEmails();
        userEmailBloomFilter = BloomFilter.create(
                Funnels.stringFunnel(StandardCharsets.UTF_8),
                allUserEmails.size(),
                0.01 // 1% false positive probability
        );
        allUserEmails.forEach(userEmailBloomFilter::put);
    }

    public boolean mightContain(String email) {
        return userEmailBloomFilter.mightContain(email);
    }

    public void put(String email) {
        userEmailBloomFilter.put(email);
    }
}
