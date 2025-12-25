package com.insurai.service;

import com.insurai.dto.PolicySummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private AiDataService aiDataService; // fetches data from DB

    private final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=";

    @PostConstruct
    public void checkApiKeyLoaded() {
        System.out.println("Gemini API Key loaded: " + (apiKey != null && !apiKey.isBlank()));
    }

    /**
     * Generic call to Gemini API
     */
    public String callGemini(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
factory.setConnectTimeout(5000); // 5 seconds to connect
factory.setReadTimeout(10000);   // 10 seconds to read response
restTemplate.setRequestFactory(factory);


            String requestBody = """
            {
              "contents": [
                {
                  "parts": [
                    { "text": "%s" }
                  ]
                }
              ]
            }
            """.formatted(prompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            String safeApiKey = URLEncoder.encode(apiKey.trim(), StandardCharsets.UTF_8);

            ResponseEntity<String> response = restTemplate.exchange(
                    GEMINI_URL + safeApiKey,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getBody() == null) return null;

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) return null;

            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty()) return null;

            String text = parts.get(0).path("text").asText(null);
            return (text == null || text.isBlank()) ? null : text;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Standard AI response (generic)
     */
   public String generateText(String prompt) {
    try {
        System.out.println("AI PROMPT SENT:\n" + prompt);

        String response = callGemini(prompt);

        System.out.println("AI RESPONSE:\n" + response);

        if (response == null || response.isBlank()) {
            return "No meaningful answer could be generated from the policy data.";
        }

        return response;

    } catch (Exception e) {
        e.printStackTrace();
        return "AI service is currently unavailable. Please try again.";
    }
}


    /**
     * Generate client-specific response including their policies
     */
    public String generateClientResponse(Long clientId, String userQuestion) {
        List<PolicySummaryDTO> policies = aiDataService.getClientPolicies(clientId);
        String policyInfo = buildPolicyInfoText(policies);

        String prompt = """
                You are a professional corporate insurance expert.
                Use the following client policy info to answer the question:
                %s
                Question: %s
                """.formatted(policyInfo, userQuestion);

        return callGemini(prompt);
    }

    /**
     * Generate admin-side response using all policies
     */
    public String generateAdminResponse(String userQuestion) {
        List<PolicySummaryDTO> policies = aiDataService.getAllAdminPolicies();
        String policyInfo = buildPolicyInfoText(policies);

        String prompt = """
                You are a professional corporate insurance expert.
                don't use ** and any symbol use a proper format of answers
                Use the following admin policy info to answer the question:
                %s
                Question: %s
                """.formatted(policyInfo, userQuestion);

        return callGemini(prompt);
    }

    /**
     * Helper: convert policy list to readable text
     */
    private String buildPolicyInfoText(List<PolicySummaryDTO> policies) {
        if (policies == null || policies.isEmpty()) return "No policy information available.";

        return policies.stream()
                .map(p -> String.format(
                        "Name: %s, Risk: %s, Coverage: %.2f, Premium: %.2f, MinYears: %d, MaxYears: %d",
                        p.getName(),
                        p.getRiskLevel(),
                        p.getCoverageAmount().doubleValue(),
                        p.getPremiumPerYear().doubleValue(),
                        p.getMinPeriodYears(),
                        p.getMaxPeriodYears()
                ))
                .collect(Collectors.joining("\n"));
    }
}
