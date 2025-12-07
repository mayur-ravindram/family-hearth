package com.familyhearth.auth.repository;

import com.familyhearth.auth.model.MagicLinkToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface MagicLinkTokenRepository extends JpaRepository<MagicLinkToken, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<MagicLinkToken> findByTokenAndExpiresAtAfter(String token, OffsetDateTime now);
}
