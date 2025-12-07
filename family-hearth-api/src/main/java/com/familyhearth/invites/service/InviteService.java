package com.familyhearth.invites.service;

import com.familyhearth.audit.model.AuditLog;
import com.familyhearth.audit.repository.AuditLogRepository;
import com.familyhearth.invites.InviteExpiredException;
import com.familyhearth.invites.InviteNotFoundException;
import com.familyhearth.invites.UserAlreadyExistsException;
import com.familyhearth.invites.dto.AcceptInviteRequest;
import com.familyhearth.invites.model.Invite;
import com.familyhearth.invites.repository.InviteRepository;
import com.familyhearth.user.model.CustomUserDetails;
import com.familyhearth.user.model.Role;
import com.familyhearth.user.model.User;
import com.familyhearth.user.repository.UserRepository;
import com.familyhearth.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class InviteService {

    @Autowired
    private InviteRepository inviteRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Invite createInvite(Long familyId, Integer maxUses) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long currentUserId = userDetails.getUserId();

        Invite invite = new Invite();
        invite.setCode(UUID.randomUUID().toString());
        invite.setFamilyId(familyId);
        invite.setCreatedBy(currentUserId);
        invite.setExpiresAt(OffsetDateTime.now().plusDays(7));
        invite.setMaxUses(maxUses);
        Invite savedInvite = inviteRepository.save(invite);

        AuditLog auditLog = new AuditLog();
        auditLog.setUserId(currentUserId);
        auditLog.setAction("CREATE_INVITE");
        auditLog.setDetailsJson(String.format("{\"inviteCode\": \"%s\", \"familyId\": %d}", savedInvite.getCode(), familyId));
        auditLog.setCreatedAt(OffsetDateTime.now());
        auditLogRepository.save(auditLog);

        return savedInvite;
    }

    @Transactional
    public void acceptInvite(String code, AcceptInviteRequest request) {
        Invite invite = inviteRepository.findByCodeWithLock(code)
                .orElseThrow(() -> new InviteNotFoundException("Invite not found"));

        if (invite.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new InviteExpiredException("Invite has expired");
        }

        if (invite.getMaxUses() != null && invite.getMaxUses() <= 0) {
            throw new InviteExpiredException("Invite has no uses left");
        }

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        User newUser = new User();
        String[] nameParts = request.getName().split(" ", 2);
        newUser.setFirstName(nameParts[0]);
        newUser.setLastName(nameParts.length > 1 ? nameParts[1] : null);
        newUser.setEmail(request.getEmail());
        newUser.setFamilyId(invite.getFamilyId());
        newUser.setRole(Role.ROLE_USER);
        userService.save(newUser);

        if (invite.getMaxUses() != null) {
            invite.setMaxUses(invite.getMaxUses() - 1);
            inviteRepository.save(invite);
        }
    }
}
