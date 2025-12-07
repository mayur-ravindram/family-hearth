package com.familyhearth.invites;

import com.familyhearth.invites.dto.AcceptInviteRequest;
import com.familyhearth.invites.dto.InviteRequest;
import com.familyhearth.invites.model.Invite;
import com.familyhearth.invites.service.InviteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class InviteController {

    @Autowired
    private InviteService inviteService;

    @PostMapping("/families/{familyId}/invites")
    @PreAuthorize("@familyAccessManager.hasAccessToFamily(#familyId) and hasRole('ROLE_ADMIN')")
    public ResponseEntity<Invite> createInvite(@PathVariable Long familyId, @RequestBody InviteRequest request) {
        Invite invite = inviteService.createInvite(familyId, request.getMaxUses());
        return new ResponseEntity<>(invite, HttpStatus.CREATED);
    }

    @PostMapping("/invites/{code}/accept")
    public ResponseEntity<Void> acceptInvite(@PathVariable String code, @RequestBody AcceptInviteRequest request) {
        inviteService.acceptInvite(code, request);
        return ResponseEntity.ok().build();
    }
}
