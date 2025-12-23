package com.insurai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=";
 @PostConstruct
    public void checkApiKeyLoaded() {
        System.out.println(
            "Gemini API Key loaded: " + (apiKey != null && !apiKey.isBlank())
        );
    }
public String callGemini(String prompt) {
    try {
        RestTemplate restTemplate = new RestTemplate();

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

        ResponseEntity<String> response = restTemplate.exchange(
                GEMINI_URL + apiKey,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (response.getBody() == null) return null;

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response.getBody());

        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) return null;

        JsonNode parts = candidates.get(0)
                .path("content")
                .path("parts");

        if (!parts.isArray() || parts.isEmpty()) return null;

        String text = parts.get(0).path("text").asText(null);

        return (text == null || text.isBlank()) ? null : text;

    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}


public String generateText(String userInput) {
    String prompt = """
    You are a professional corporate insurance expert. Answer the user’s question in a short, clear, and easy-to-read format.
- Use numbers (1, 2, 3, …) for points, not bullets.
- Each point must start on a new line.
- Keep language simple, professional, and engaging.
- Make the answer concise, practical, and visually attractive.
- Avoid Markdown symbols (*, #, etc.).
- Focus only on the most important information.
- Do not include unnecessary details or very long paragraphs.
Question: %s
    """.formatted(userInput);

    String response = callGemini(prompt);

    if (response == null || response.isBlank()) {
        return "I couldn’t generate an answer right now. Please try again.";
    }

    return response;
}


}