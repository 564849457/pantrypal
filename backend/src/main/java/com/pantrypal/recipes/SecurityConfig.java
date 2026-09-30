package com.pantrypal.recipes;
import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
@Configuration
public class SecurityConfig {
 @Bean SecurityFilterChain apiSecurity(HttpSecurity http, SessionRepository sessions) throws Exception {
  return http
   // Java does not authenticate using browser cookies. Future write endpoints
   // must keep header-only auth; the Next.js browser boundary retains CSRF protection.
   .csrf(csrf -> csrf.disable())
   .formLogin(form -> form.disable()).httpBasic(basic -> basic.disable()).logout(logout -> logout.disable())
   .requestCache(cache -> cache.disable())
   .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(auth -> auth
    .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
    .requestMatchers(HttpMethod.GET, "/api/v1/recipes", "/api/v1/recipes/*").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/v1/me", "/api/v1/me/**").authenticated()
    .anyRequest().denyAll())
   .exceptionHandling(errors -> errors
    .authenticationEntryPoint((req, res, ex) -> SessionAuthenticationFilter.failure(res, 401, "unauthorized"))
    .accessDeniedHandler((req, res, ex) -> SessionAuthenticationFilter.failure(res, 403, "forbidden")))
   .addFilterBefore(new SessionAuthenticationFilter(sessions), AnonymousAuthenticationFilter.class)
   .build();
 }
}
