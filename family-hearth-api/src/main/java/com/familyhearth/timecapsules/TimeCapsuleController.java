package com.familyhearth.timecapsules;

import com.familyhearth.timecapsules.dto.CreateTimeCapsuleRequest;
import com.familyhearth.timecapsules.model.TimeCapsule;
import com.familyhearth.timecapsules.service.TimeCapsuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/time-capsules")
public class TimeCapsuleController {

    @Autowired
    private TimeCapsuleService timeCapsuleService;

    @PostMapping
    public ResponseEntity<TimeCapsule> createTimeCapsule(@RequestBody CreateTimeCapsuleRequest request) {
        TimeCapsule timeCapsule = timeCapsuleService.createTimeCapsule(request);
        return new ResponseEntity<>(timeCapsule, HttpStatus.CREATED);
    }
}
