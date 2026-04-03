FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY . .
# Run the app using the wrapper
ENTRYPOINT ["./mvnw", "spring-boot:run"]