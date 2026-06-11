package com.usco.ms_usuarios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MsUsuariosApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsUsuariosApplication.class, args);
    }
}