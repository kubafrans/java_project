FROM maven:3.8.4-openjdk-17-slim AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/swagger-gateway-1.0.0.jar app.jar

EXPOSE 8085

CMD ["java", "-jar", "app.jar"]
