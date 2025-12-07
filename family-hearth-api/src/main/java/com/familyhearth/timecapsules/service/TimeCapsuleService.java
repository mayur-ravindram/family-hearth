package com.familyhearth.timecapsules.service;

import com.familyhearth.timecapsules.dto.CreateTimeCapsuleRequest;
import com.familyhearth.timecapsules.model.TimeCapsule;
import com.familyhearth.timecapsules.repository.TimeCapsuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TimeCapsuleService {

    @Autowired
    private TimeCapsuleRepository timeCapsuleRepository;

    public TimeCapsule createTimeCapsule(CreateTimeCapsuleRequest request) {
        // TODO: Implement time capsule creation logic
        return null;
    }
}
