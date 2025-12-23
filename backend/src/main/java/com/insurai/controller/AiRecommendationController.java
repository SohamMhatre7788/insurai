package com.insurai.controller;

//import com.insurai.model.CorporateScenario;
import com.insurai.service.*;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiRecommendationController {

    private final GeminiAiService geminiAiService;

    public AiRecommendationController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }
@PostMapping("/corporate-recommendation")
public Map<String, String> handleAi(@RequestBody Map<String, String> request) {

    String userInput = request.get("input");

    // ✅ 1. GREETING SHORT-CIRCUIT (NO GEMINI)
    if (isGreeting(userInput)) {
        return Map.of(
            "response", "Hello! How can I help you with corporate insurance today?"
        );
    }

    // ✅ 2. NORMAL AI RESPONSE
    String reply = geminiAiService.generateText(userInput);

    return Map.of(
        "response", reply
    );
}
    private boolean isGreeting(String input) {
        String lowered = input.toLowerCase();
        return lowered.contains("hello") || lowered.contains("hi") || lowered.contains("greetings");
    }

}

    


