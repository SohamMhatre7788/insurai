package com.insurai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_policy_id", nullable = false)
    private ClientPolicy clientPolicy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal claimAmountRequested;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal maxCoverageForPolicy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(precision = 12, scale = 2)
    private BigDecimal approvedCoverageAmount;

    @ElementCollection
    @CollectionTable(name = "claim_documents", joinColumns = @JoinColumn(name = "claim_id"))
    @Column(name = "document_url", length = 500)
    private List<String> supportingDocumentUrls = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ClaimStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
