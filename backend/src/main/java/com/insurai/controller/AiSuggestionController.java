package com.insurai.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/ai")
public class AiSuggestionController {

    @GetMapping("/admin-suggestions")
    public Map<String, List<String>> adminSuggestions() {
        return Map.of("questions", List.of(
            "List all corporate insurance policies",
            "Show coverage and premium details",
            "Which policies have high risk?",
            "How to create a new corporate policy?"
        ));
    }

    @GetMapping("/client-suggestions")
    public Map<String, List<String>> clientSuggestions(@RequestParam Long clientId) {
        return Map.of("questions", List.of(
            "Which policies do I currently have?",
            "What is my coverage amount?",
            "What is my yearly premium?",
            "How can I file a claim?"
        ));
    }
}
