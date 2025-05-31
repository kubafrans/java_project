package com.warehouse.auth.controller;

import com.warehouse.auth.dto.AuthResponse;
import com.warehouse.auth.dto.LoginRequest;
import com.warehouse.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${users-service.url}")
    private String usersServiceUrl;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "auth-service");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Get user from Users service
            String userUrl = usersServiceUrl + "/api/users/username/" + loginRequest.getUsername();
            ResponseEntity<Map> userResponse = restTemplate.getForEntity(userUrl, Map.class);
            
            if (userResponse.getStatusCode().is2xxSuccessful() && userResponse.getBody() != null) {
                Map<String, Object> user = userResponse.getBody();
                String storedPassword = (String) user.get("password");
                String role = (String) user.get("role");
                
                if (passwordEncoder.matches(loginRequest.getPassword(), storedPassword)) {
                    String token = jwtUtil.generateToken(loginRequest.getUsername(), role);
                    return ResponseEntity.ok(new AuthResponse(token, loginRequest.getUsername(), role));
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody Map<String, String> registerRequest) {
        try {
            // Create user via Users service
            String userUrl = usersServiceUrl + "/api/users";
            ResponseEntity<Map> userResponse = restTemplate.postForEntity(userUrl, registerRequest, Map.class);
            
            if (userResponse.getStatusCode().is2xxSuccessful() && userResponse.getBody() != null) {
                Map<String, Object> user = userResponse.getBody();
                String username = (String) user.get("username");
                String role = (String) user.get("role");
                
                String token = jwtUtil.generateToken(username, role);
                return ResponseEntity.ok(new AuthResponse(token, username, role));
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String username = request.get("username");
            Boolean isValid = jwtUtil.validateToken(token, username);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
