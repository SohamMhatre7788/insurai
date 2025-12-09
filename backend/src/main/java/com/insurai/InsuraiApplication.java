package com.insurai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InsuraiApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuraiApplication.class, args);
    }
}
