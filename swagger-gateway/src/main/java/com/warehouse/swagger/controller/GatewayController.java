package com.warehouse.swagger.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@Tag(name = "API Gateway", description = "Centralized API documentation gateway")
public class GatewayController {
    
    @GetMapping("/")
    @Operation(summary = "API Overview", description = "Get overview of all available microservices")
    @ApiResponse(responseCode = "200", description = "API overview retrieved successfully")
    public Map<String, Object> apiOverview() {
        Map<String, Object> response = new HashMap<>();
        response.put("title", "Warehouse Management System API");
        response.put("version", "1.0.0");
        response.put("description", "Centralized API documentation for warehouse management microservices");
        
        Map<String, String> services = new HashMap<>();
        services.put("Items Service", "/api/items/ - Warehouse inventory management");
        services.put("Orders Service", "/api/orders/ - Order processing and management");
        services.put("Users Service", "/api/users/ - User profiles and management");
        services.put("Auth Service", "/api/auth/ - Authentication and JWT tokens");
        response.put("services", services);
        
        Map<String, String> documentation = new HashMap<>();
        documentation.put("Swagger UI", "/swagger-ui/index.html - Interactive API documentation");
        documentation.put("OpenAPI Spec", "/v3/api-docs - OpenAPI 3.0 specification");
        response.put("documentation", documentation);
        
        return response;
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the swagger gateway is running")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "swagger-gateway");
        return response;
    }
}
