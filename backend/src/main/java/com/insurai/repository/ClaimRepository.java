package com.insurai.repository;

import com.insurai.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByClientId(Long clientId);

    List<Claim> findByStatus(Claim.ClaimStatus status);
    // Or if you only want the statuses
      @Query("SELECT c.status FROM Claim c WHERE c.client.id = :clientId")
    List<Claim.ClaimStatus> findStatusesByClientId(@Param("clientId") Long clientId);

}
