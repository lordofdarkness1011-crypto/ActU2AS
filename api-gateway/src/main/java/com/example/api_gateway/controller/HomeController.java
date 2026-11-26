package com.example.api_gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> inicio() {
        return Map.of(
            "mensaje", "API Gateway ejecutándose con éxito",
            "rutas", Map.of(
                "clientes", "/api/clientes",
                "productos", "/api/productos",
                "facturas", "/api/facturas"
            )
        );
    }
}
