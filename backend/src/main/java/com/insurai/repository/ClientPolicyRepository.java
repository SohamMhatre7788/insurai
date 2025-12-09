package com.insurai.repository;

import com.insurai.entity.ClientPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientPolicyRepository extends JpaRepository<ClientPolicy, Long> {

    List<ClientPolicy> findByClientId(Long clientId);

    List<ClientPolicy> findByClientIdAndStatus(Long clientId, ClientPolicy.PolicyStatus status);
}
