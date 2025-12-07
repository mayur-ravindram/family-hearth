package com.familyhearth.timecapsules.dto;

import java.time.OffsetDateTime;

public class CreateTimeCapsuleRequest {
    private Long familyId;
    private Object content;
    private OffsetDateTime visibleAt;

    public Long getFamilyId() {
        return familyId;
    }

    public void setFamilyId(Long familyId) {
        this.familyId = familyId;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public OffsetDateTime getVisibleAt() {
        return visibleAt;
    }

    public void setVisibleAt(OffsetDateTime visibleAt) {
        this.visibleAt = visibleAt;
    }
}
