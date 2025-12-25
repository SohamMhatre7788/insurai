package com.insurai.repository;

import com.insurai.entity.ClientPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientPolicyRepository extends JpaRepository<ClientPolicy, Long> {

    List<ClientPolicy> findByClientId(Long clientId);

    List<ClientPolicy> findByClientIdAndStatus(Long clientId, ClientPolicy.PolicyStatus status);
    // Option 2: Return only policy names
  @Query("SELECT cp.policy.name FROM ClientPolicy cp WHERE cp.client.id = :clientId")
    List<String> findPolicyNamesByClientId(@Param("clientId") Long clientId);
}
