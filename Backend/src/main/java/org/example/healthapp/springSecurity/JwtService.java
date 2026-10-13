package org.example.healthapp.springSecurity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.example.healthapp.models.Secretary;
import org.example.healthapp.models.User;
import org.example.healthapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Autowired
    private UserRepository userRepository; // ✅ Injecter le repository

    @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String secretKey;

    @Value("${jwt.expiration:2592000000}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        claims.put("role", role);

        try {
            String email = userDetails.getUsername();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            claims.put("userId", user.getId());

            // ⭐ AJOUTER DES LOGS DE DEBUG
            System.out.println("=== DEBUG TOKEN GENERATION ===");
            System.out.println("User ID: " + user.getId());
            System.out.println("User Role: " + role);
            System.out.println("User Class: " + user.getClass().getName());

            // Si c'est une secrétaire, ajouter le doctorId
            if ("SECRETARY".equals(role)) {
                System.out.println("✅ User is SECRETARY");

                // ⚠️ UTILISEZ LE NOM CORRECT DE VOTRE CLASSE
                if (user instanceof Secretary) {  // ← Vérifiez ce nom !
                    System.out.println("✅ User is instance of Secretaire");
                    Secretary secretaire = (Secretary) user;

                    System.out.println("Doctor object: " + secretaire.getDoctor());

                    if (secretaire.getDoctor() != null) {
                        Long doctorId = secretaire.getDoctor().getId();
                        System.out.println("✅ Doctor ID found: " + doctorId);
                        claims.put("doctorId", doctorId);
                    } else {
                        System.out.println("⚠️ Doctor is NULL");
                    }
                } else {
                    System.out.println("❌ User is NOT instance of Secretaire, actual class: " + user.getClass().getName());
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la génération du token: " + e.getMessage());
            e.printStackTrace();
        }

        return generateToken(claims, userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}