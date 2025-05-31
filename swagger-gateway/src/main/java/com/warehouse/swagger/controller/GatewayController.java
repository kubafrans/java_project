package com.warehouse.swagger.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@Tag(name = "API Gateway", description = "Centralized API documentation gateway")
public class GatewayController {
    
    @Autowired
    private RestTemplate restTemplate;
    
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
        documentation.put("Items API Spec", "/docs/items - Items service OpenAPI spec");
        documentation.put("Orders API Spec", "/docs/orders - Orders service OpenAPI spec");
        documentation.put("Users API Spec", "/docs/users - Users service OpenAPI spec");
        documentation.put("Auth API Spec", "/docs/auth - Auth service OpenAPI spec");
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
    
    // Proxy OpenAPI specs from individual services
    @GetMapping("/docs/{service}")
    public ResponseEntity<String> getServiceOpenApiSpec(@PathVariable String service) {
        try {
            String serviceUrl = getServiceUrl(service);
            if (serviceUrl == null) {
                return ResponseEntity.notFound().build();
            }
            
            String openApiUrl = serviceUrl + "/v3/api-docs";
            String openApiSpec = restTemplate.getForObject(openApiUrl, String.class);
            
            // Update the spec to use correct server URLs
            if (openApiSpec != null) {
                openApiSpec = openApiSpec.replace("\"url\":\"http://" + service + "-service:808", 
                                                "\"url\":\"http://localhost:8080/api/" + service);
                openApiSpec = openApiSpec.replace("\"url\":\"/\"", 
                                                "\"url\":\"http://localhost:8080/api/" + service + "\"");
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "*");
            
            return new ResponseEntity<>(openApiSpec, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Failed to fetch OpenAPI spec for " + service + "\"}");
        }
    }
    
    private String getServiceUrl(String service) {
        switch (service.toLowerCase()) {
            case "items":
                return "http://items-service:8081";
            case "orders":
                return "http://orders-service:8082";
            case "users":
                return "http://users-service:8083";
            case "auth":
                return "http://auth-service:8084";
            default:
                return null;
        }
    }
}
