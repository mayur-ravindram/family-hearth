package com.familyhearth.sync;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sync")
public class SyncController {

    @PostMapping("/batch")
    public ResponseEntity<Void> syncBatch() {
        // TODO: Implement batch sync logic
        return ResponseEntity.ok().build();
    }
}
