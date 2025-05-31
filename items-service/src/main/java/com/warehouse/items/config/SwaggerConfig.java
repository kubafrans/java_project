package com.warehouse.items.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI itemsServiceOpenAPI() {
        Server server = new Server();
        server.setUrl("/");
        server.setDescription("Items Service API");

        Contact contact = new Contact();
        contact.setName("Warehouse Management Team");
        contact.setEmail("team@warehouse.com");

        Info info = new Info()
                .title("Items Service API")
                .version("1.0.0")
                .description("Warehouse Items Management Service")
                .contact(contact);

        return new OpenAPI()
                .info(info)
                .servers(List.of(server));
    }
}
