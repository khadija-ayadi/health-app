package org.example.healthapp.springSecurity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configuration CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ✅ Endpoints publics
                        .requestMatchers("/api/auth/**", "/api/users/**").permitAll()
                        .requestMatchers("/api/patients/register").permitAll()

                        // ✅ Endpoints accessibles par DOCTOR et SECRETARY
                        .requestMatchers("/api/patients/doctor/**").hasAnyRole("DOCTOR", "SECRETARY")
                        .requestMatchers("/api/rendezvous/doctor/**").hasAnyRole("DOCTOR", "SECRETARY")
                        .requestMatchers(HttpMethod.GET, "/api/patients/*/rendezvous").hasAnyRole("PATIENT", "DOCTOR","SECRETARY")
                        // ✅ Endpoints spécifiques aux DOCTORS
                        .requestMatchers("/api/doctors/**").hasRole("DOCTOR")

                        // ✅ Endpoints spécifiques à la SECRETARY
                        .requestMatchers(HttpMethod.POST, "/api/secritaire/fiche/**").hasAnyRole("SECRETARY", "DOCTOR")
                        .requestMatchers("/api/secritaire/**").hasRole("SECRETARY")

                        // ✅ Endpoints pour les PATIENTS (à placer APRÈS les règles plus spécifiques)
                        .requestMatchers("/api/patients/**").hasRole("PATIENT")
                        .requestMatchers("/api/contact/send").permitAll()  // ← AJOUTER CETTE LIGNE

                        // ✅ Endpoints admin pour les messages de contact
                        .requestMatchers("/api/contact/**").hasRole("ADMIN")
                        // ✅ Tous les autres endpoints nécessitent une authentification
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autoriser les requêtes depuis Angular (localhost:4200)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Permettre l'envoi des credentials (cookies, authorization headers, etc.)
        configuration.setAllowCredentials(true);

        // Durée de cache de la requête preflight (en secondes)
        configuration.setMaxAge(3600L);

        // Appliquer la configuration à tous les endpoints /api/**
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}