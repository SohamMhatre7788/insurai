package com.insurai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendClaimSubmittedEmail(String adminEmail, String claimDetails) {
        log.info("EMAIL: Sending claim submitted notification to admin");
        log.info("To: {}", adminEmail);
        log.info("Subject: New Claim Submitted");
        log.info("Body: {}", claimDetails);
        // In production, implement actual email sending logic here
    }

    public void sendClaimApprovedEmail(String clientEmail, String claimDetails, String approvedAmount) {
        log.info("EMAIL: Sending claim approved notification to client");
        log.info("To: {}", clientEmail);
        log.info("Subject: Your Claim has been Approved");
        log.info("Body: Your claim has been approved for amount: {}", approvedAmount);
        log.info("Details: {}", claimDetails);
    }

    public void sendClaimRejectedEmail(String clientEmail, String claimDetails, String rejectionReason) {
        log.info("EMAIL: Sending claim rejected notification to client");
        log.info("To: {}", clientEmail);
        log.info("Subject: Your Claim has been Rejected");
        log.info("Body: Your claim has been rejected. Reason: {}", rejectionReason);
        log.info("Details: {}", claimDetails);
    }
}
