// package com.insurai.controller;
// import com.insurai.service.GeminiService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import lombok.RequiredArgsConstructor;



// @RestController
// @RequestMapping("/gemini")
// @RequiredAugsConstructor
// public class GeminiController {
    
//     @Autowired
//     private final GeminiService geminiService;

//     @GetMapping("/ask")
//     public String askGeminiAPI(@RequestBody String prompt){
//         return geminiService.askGemini(prompt);
//     }
// }
