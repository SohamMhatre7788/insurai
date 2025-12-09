package com.insurai.repository;

import com.insurai.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByClientId(Long clientId);

    List<Claim> findByStatus(Claim.ClaimStatus status);
}
