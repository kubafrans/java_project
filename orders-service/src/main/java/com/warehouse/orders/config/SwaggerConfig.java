package com.warehouse.orders.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI ordersServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Orders Service API")
                        .description("Warehouse Orders Management Service")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Warehouse Team")
                                .email("team@warehouse.com")));
    }
}
