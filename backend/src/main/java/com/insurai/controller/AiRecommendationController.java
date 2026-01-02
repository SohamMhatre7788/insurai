package com.insurai.controller;

import com.insurai.dto.PolicySummaryDTO;
import com.insurai.security.CustomUserDetails;
import com.insurai.service.AiDataService;
import com.insurai.service.GeminiAiService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiRecommendationController {

    private final GeminiAiService geminiAiService;
    private final AiDataService aiDataService;

    public AiRecommendationController(GeminiAiService geminiAiService,
            AiDataService aiDataService) {
        this.geminiAiService = geminiAiService;
        this.aiDataService = aiDataService;
    }

    // ---------------- CLIENT AI ----------------
    @PostMapping("/client-recommendation")
    public Map<String, String> getClientRecommendation(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String question = request.get("input");
        if (question == null || question.isBlank()) {
            return Map.of("response", "Question cannot be empty.");
        }

        // Extract clientId from CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long clientId = userDetails.getUserId();

        // Fetch client policies
        List<PolicySummaryDTO> clientPolicies = aiDataService.getClientPolicies(clientId);

        // Build prompt for AI
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a corporate insurance expert. Answer clearly.\n");
        prompt.append("IMPORTANT: All currency amounts are in Indian Rupees (INR). \n");
        prompt.append("NEVER use dollar signs ($). ALWAYS use Rupees or INR or ₹.\n");

        if (clientPolicies.isEmpty()) {
            prompt.append("Client has no active policies.\n");
        } else {
            prompt.append("Client policies:\n");
            for (PolicySummaryDTO p : clientPolicies) {
                prompt.append("- ")
                        .append(p.getName())
                        .append(", Coverage: ₹").append(p.getCoverageAmount()).append(" INR")
                        .append(", Premium: ₹").append(p.getPremiumPerYear()).append(" INR")
                        .append(", Risk: ").append(p.getRiskLevel())
                        .append(", Period: ")
                        .append(p.getMinPeriodYears()).append("-")
                        .append(p.getMaxPeriodYears())
                        .append(" years\n");
            }
        }

        prompt.append("Question: ").append(question);

        // Call AI service
        String reply = geminiAiService.generateText(prompt.toString());

        return Map.of(
                "response",
                reply == null || reply.isBlank()
                        ? "AI did not return a response. Please try again."
                        : reply);
    }

    // ---------------- ADMIN AI ----------------
    @PostMapping("/admin-recommendation")
    public Map<String, String> getAdminRecommendation(
            @RequestBody Map<String, String> request) {

        String question = request.get("input");
        List<PolicySummaryDTO> allPolicies = aiDataService.getAllAdminPolicies();

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are helping an insurance admin.\n");
        prompt.append("IMPORTANT: All currency amounts are in Indian Rupees (INR). \n");
        prompt.append("NEVER use dollar signs ($). ALWAYS use Rupees or INR or ₹.\n");
        prompt.append("System policies:\n");

        for (PolicySummaryDTO p : allPolicies) {
            prompt.append("- ")
                    .append(p.getName())
                    .append(", Coverage: ₹").append(p.getCoverageAmount()).append(" INR")
                    .append(", Premium: ₹").append(p.getPremiumPerYear()).append(" INR")
                    .append(", Risk: ").append(p.getRiskLevel())
                    .append(", Period: ")
                    .append(p.getMinPeriodYears()).append("-")
                    .append(p.getMaxPeriodYears())
                    .append(" years\n");
        }

        prompt.append("Question: ").append(question);

        String reply = geminiAiService.generateText(prompt.toString());
        return Map.of("response", reply);
    }

    // ---------------- GENERAL AI ----------------
    @PostMapping("/general")
    public Map<String, String> getGeneralRecommendation(
            @RequestBody Map<String, String> request) {

        String question = request.get("input");

        if (isGreeting(question)) {
            return Map.of(
                    "response",
                    "Hello! How can I help you with corporate insurance today?");
        }

        String reply = geminiAiService.generateText(question);
        return Map.of("response", reply);
    }

    private boolean isGreeting(String input) {
        if (input == null)
            return false;
        String lowered = input.toLowerCase();
        return lowered.contains("hello")
                || lowered.contains("hi")
                || lowered.contains("greetings");
    }
}
