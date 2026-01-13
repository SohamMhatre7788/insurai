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
        prompt.append(
                "You are an expert corporate insurance advisor with comprehensive knowledge of insurance concepts, policies, and industry practices.\n");
        prompt.append("IMPORTANT INSTRUCTIONS:\n");
        prompt.append(
                "1. All currency amounts are in Indian Rupees (INR). NEVER use dollar signs ($). ALWAYS use Rupees, INR, or ₹.\n");
        prompt.append(
                "2. You can answer BOTH general insurance questions AND specific questions about the client's policies.\n");
        prompt.append(
                "3. For general questions (e.g., 'What is corporate insurance?', 'How does claim processing work?'), provide clear educational answers.\n");
        prompt.append("4. For specific questions about the client's policies, use the data provided below.\n");
        prompt.append("5. Provide professional, helpful, and accurate responses.\n\n");

        if (clientPolicies.isEmpty()) {
            prompt.append("CLIENT POLICY STATUS: This client has no active policies.\n\n");
        } else {
            prompt.append("CLIENT POLICIES:\n");
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
            prompt.append("\n");
        }

        prompt.append("CLIENT QUESTION: ").append(question);

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
        prompt.append("You are a senior corporate insurance expert assisting an insurance administrator.\n");
        prompt.append("IMPORTANT INSTRUCTIONS:\n");
        prompt.append(
                "1. All currency amounts are in Indian Rupees (INR). NEVER use dollar signs ($). ALWAYS use Rupees, INR, or ₹.\n");
        prompt.append(
                "2. You can answer BOTH general insurance questions AND specific questions about system policies.\n");
        prompt.append(
                "3. For general questions (e.g., 'Best practices for policy management', 'Insurance industry trends'), provide expert insights.\n");
        prompt.append("4. For specific questions about policies, use the system data provided below.\n");
        prompt.append("5. Provide strategic, professional advice suitable for administrators.\n\n");

        if (allPolicies.isEmpty()) {
            prompt.append("SYSTEM STATUS: No policies currently in the system.\n\n");
        } else {
            prompt.append("SYSTEM POLICIES:\n");
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
            prompt.append("\n");
        }

        prompt.append("ADMIN QUESTION: ").append(question);

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
                    "Hello! I'm your corporate insurance expert. I can help you with insurance concepts, policy information, and general questions. How may I assist you today?");
        }

        // Add insurance context to general questions
        StringBuilder enhancedPrompt = new StringBuilder();
        enhancedPrompt.append("You are a professional corporate insurance expert.\n");
        enhancedPrompt.append("Provide clear, accurate, and helpful information about insurance topics.\n");
        enhancedPrompt.append(
                "If the question is not related to insurance, politely redirect to insurance-related topics.\n");
        enhancedPrompt.append("IMPORTANT: All currency amounts should be in Indian Rupees (INR). Use ₹ symbol.\n\n");
        enhancedPrompt.append("Question: ").append(question);

        String reply = geminiAiService.generateText(enhancedPrompt.toString());
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
