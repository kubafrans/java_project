package com.warehouse.auth.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class RootController {
    
    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Warehouse Management System API");
        response.put("version", "1.0.0");
        response.put("services", new String[]{
            "Items Service: /api/items/",
            "Orders Service: /api/orders/",
            "Users Service: /api/users/",
            "Auth Service: /api/auth/"
        });
        return response;
    }
}
