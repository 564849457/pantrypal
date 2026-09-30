package com.pantrypal.recipes;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication(exclude = org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class)
public class PantryPalApplication {
 public static void main(String[] args) { SpringApplication.run(PantryPalApplication.class, args); }
}
